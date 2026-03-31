/**
 * Tests for imageService — Flux Pro + DALL-E 3 auto-routing with fallback
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateAllViews, generateShoeImage } from '../imageService'

// Mock configService
vi.mock('../configService', () => ({
  configService: {
    getOpenAIKey: vi.fn().mockReturnValue(null),
    getReplicateKey: vi.fn().mockReturnValue(null),
    getBestEngine: vi.fn().mockReturnValue(null),
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
    it('should throw when no engine available', async () => {
      await expect(generateShoeImage('test')).rejects.toThrow('Aucune clé API image configurée')
    })

    it('should call DALL-E when getBestEngine returns dalle3', async () => {
      const { configService } = await import('../configService')
      configService.getBestEngine.mockReturnValue('dalle3')
      configService.getOpenAIKey.mockReturnValue('sk-proj-test')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [{ url: 'https://img.test/dalle.png', revised_prompt: 'revised' }],
        }),
      })

      const result = await generateShoeImage('test prompt')
      expect(result.imageUrl).toBe('https://img.test/dalle.png')
      expect(result.engine).toBe('dalle3')
      expect(result.cost_usd).toBe(0.080)
    })

    it('should fallback to DALL-E when Flux fails and OpenAI key available', async () => {
      const { configService } = await import('../configService')
      configService.getBestEngine.mockReturnValue('flux_pro')
      configService.getReplicateKey.mockReturnValue('r8_test')
      configService.getOpenAIKey.mockReturnValue('sk-proj-test')

      // Flux call fails
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 500 })
        // DALL-E fallback succeeds
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            data: [{ url: 'https://img.test/fallback.png' }],
          }),
        })

      const result = await generateShoeImage('test')
      expect(result.imageUrl).toBe('https://img.test/fallback.png')
      expect(result.engine).toBe('dalle3')
    })
  })

  describe('generateAllViews', () => {
    it('should return 5 results for 5 view prompts', async () => {
      const viewPrompts = Array.from({ length: 5 }, (_, i) => ({
        view_id: `view_${i}`,
        dalle_optimized: `prompt_${i}`,
        flux_optimized: `flux_${i}`,
      }))

      const results = await generateAllViews(viewPrompts)
      expect(results).toHaveLength(5)
    })

    it('should call onResult for each completed view', async () => {
      const viewPrompts = [
        { view_id: 'three_quarter', dalle_optimized: 'p1', flux_optimized: 'f1' },
        { view_id: 'side_profile', dalle_optimized: 'p2', flux_optimized: 'f2' },
      ]

      const onResult = vi.fn()
      await generateAllViews(viewPrompts, { onResult })

      expect(onResult).toHaveBeenCalledTimes(2)
    })

    it('all results should have error status without any API key', async () => {
      const viewPrompts = [
        { view_id: 'three_quarter', dalle_optimized: 'p', flux_optimized: 'f' },
      ]

      const results = await generateAllViews(viewPrompts)
      expect(results.every((r) => r.status === 'error')).toBe(true)
    })

    it('each result should have correct shape with engine field', async () => {
      const { configService } = await import('../configService')
      configService.getBestEngine.mockReturnValue('dalle3')

      const viewPrompts = [{ view_id: 'worn', dalle_optimized: 'p', flux_optimized: 'f' }]
      const results = await generateAllViews(viewPrompts)

      expect(results[0]).toHaveProperty('view_id', 'worn')
      expect(results[0]).toHaveProperty('imageUrl')
      expect(results[0]).toHaveProperty('status')
      expect(results[0]).toHaveProperty('generation_time_ms')
      expect(results[0]).toHaveProperty('cost_usd')
      expect(results[0]).toHaveProperty('engine')
    })
  })
})
