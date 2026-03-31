/**
 * Tests for visionService — GPT-4o Vision analysis
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { analyzeShoeImage } from '../visionService'

// Mock configService
vi.mock('../configService', () => ({
  configService: {
    getOpenAIKey: vi.fn().mockReturnValue(null),
    hasValidConfig: vi.fn().mockReturnValue(false),
  },
}))

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('visionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return error when no API key', async () => {
    const file = new File(['test'], 'shoe.jpg', { type: 'image/jpeg' })
    const result = await analyzeShoeImage(file)

    expect(result.error).toContain('Clé API OpenAI non configurée')
    expect(result.extractedSpecs).toBeNull()
  })

  it('should return error for oversized file', async () => {
    const { configService } = await import('../configService')
    configService.getOpenAIKey.mockReturnValue('sk-proj-test')

    // Create a file > 10MB
    const bigContent = new ArrayBuffer(11 * 1024 * 1024)
    const file = new File([bigContent], 'huge.jpg', { type: 'image/jpeg' })

    const result = await analyzeShoeImage(file)
    expect(result.error).toContain('trop volumineux')
  })

  it('should detect photo mode for jpg files', async () => {
    const file = new File(['test'], 'shoe.jpg', { type: 'image/jpeg' })
    const result = await analyzeShoeImage(file)
    // Even with error, mode should be detected
    expect(result.mode).toBe('photo')
  })

  it('should detect photo mode by default', async () => {
    const file = new File(['test'], 'shoe.png', { type: 'image/png' })
    const result = await analyzeShoeImage(file)
    // Without API key, error is returned but mode defaults to 'photo'
    expect(result.mode).toBe('photo')
  })

  it('should return extractedSpecs structure on success', async () => {
    const { configService } = await import('../configService')
    configService.getOpenAIKey.mockReturnValue('sk-proj-test')

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        choices: [{
          message: {
            content: JSON.stringify({
              segment: 'homme',
              materials: { upper: 'vachette', lining: 'chevreau', sole: 'cuir' },
              construction: 'cousu_goodyear',
              sole: 'cuir_semelle',
              finishing: 'patine',
              colors: ['noir'],
              style: 'classique',
              type: 'richelieu',
              confidence: 0.92,
              description: 'Richelieu homme cuir noir cousu Goodyear',
              suggestions: ['Ajouter medallion cap toe'],
            }),
          },
        }],
      }),
    })

    const file = new File(['test'], 'shoe.jpg', { type: 'image/jpeg' })
    const result = await analyzeShoeImage(file)

    expect(result.extractedSpecs).toBeDefined()
    expect(result.extractedSpecs.segment).toBe('homme')
    expect(result.extractedSpecs.type).toBe('richelieu')
    expect(result.extractedSpecs.materials.upper).toBe('vachette')
    expect(result.confidence).toBe(0.92)
    expect(result.description).toBe('Richelieu homme cuir noir cousu Goodyear')
    expect(result.suggestions).toContain('Ajouter medallion cap toe')
  })

  it('should handle API errors gracefully', async () => {
    const { configService } = await import('../configService')
    configService.getOpenAIKey.mockReturnValue('sk-proj-test')

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ error: { message: 'Rate limit exceeded' } }),
    })

    const file = new File(['test'], 'shoe.jpg', { type: 'image/jpeg' })
    const result = await analyzeShoeImage(file)

    expect(result.error).toContain('Rate limit exceeded')
    expect(result.extractedSpecs).toBeNull()
  })
})
