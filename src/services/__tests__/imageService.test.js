/**
 * Tests for imageService — OpenAI DALL-E 3 only
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateAllViews, generateShoeImage } from '../imageService'

// Mock configService
vi.mock('../configService', () => ({
  configService: {
    getOpenAIKey: vi.fn().mockReturnValue(null),
  },
}))

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('imageService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateShoeImage', () => {
    it('should throw when no API key', async () => {
      await expect(generateShoeImage('test prompt')).rejects.toThrow('Clé API OpenAI non configurée')
    })

    it('should call OpenAI with correct parameters when key is set', async () => {
      const { configService } = await import('../configService')
      configService.getOpenAIKey.mockReturnValue('sk-proj-test')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [{ url: 'https://example.com/image.png', revised_prompt: 'revised' }],
        }),
      })

      const result = await generateShoeImage('test prompt')
      expect(result.imageUrl).toBe('https://example.com/image.png')
      expect(result.revisedPrompt).toBe('revised')
      expect(result.cost_usd).toBe(0.080)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/images/generations',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer sk-proj-test',
          }),
        })
      )
    })
  })

  describe('generateAllViews', () => {
    it('should return 5 results for 5 view prompts', async () => {
      const viewPrompts = Array.from({ length: 5 }, (_, i) => ({
        view_id: `view_${i}`,
        dalle_optimized: `prompt_${i}`,
      }))

      const results = await generateAllViews(viewPrompts)
      expect(results).toHaveLength(5)
    })

    it('should call onResult for each completed view', async () => {
      const viewPrompts = [
        { view_id: 'three_quarter', dalle_optimized: 'p1' },
        { view_id: 'side_profile', dalle_optimized: 'p2' },
      ]

      const onResult = vi.fn()
      const results = await generateAllViews(viewPrompts, { onResult })

      expect(onResult).toHaveBeenCalledTimes(2)
      expect(results).toHaveLength(2)
    })

    it('all results should have error status without API key', async () => {
      const viewPrompts = [
        { view_id: 'three_quarter', dalle_optimized: 'p' },
        { view_id: 'sole', dalle_optimized: 'p' },
      ]

      const results = await generateAllViews(viewPrompts)
      expect(results.every((r) => r.status === 'error')).toBe(true)
    })

    it('each result should have correct RenderResult shape', async () => {
      const viewPrompts = [{ view_id: 'worn', dalle_optimized: 'p' }]
      const results = await generateAllViews(viewPrompts)

      expect(results[0]).toHaveProperty('view_id', 'worn')
      expect(results[0]).toHaveProperty('imageUrl')
      expect(results[0]).toHaveProperty('status')
      expect(results[0]).toHaveProperty('generation_time_ms')
      expect(results[0]).toHaveProperty('cost_usd')
    })
  })
})
