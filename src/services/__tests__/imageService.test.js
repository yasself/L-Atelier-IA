/**
 * Tests for imageService.js — dual-engine parallel generation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateAllViews, generateSingleView } from '../imageService'

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Mock import.meta.env
vi.stubGlobal('import', { meta: { env: {} } })

describe('imageService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateSingleView', () => {
    it('should return error when no API key for flux', async () => {
      const viewPrompt = {
        view_id: 'three_quarter',
        flux_optimized: 'test prompt',
        dalle_optimized: 'test prompt',
      }

      const result = await generateSingleView(viewPrompt, 'flux')
      expect(result.status).toBe('error')
      expect(result.view_id).toBe('three_quarter')
      expect(result.engine).toBe('flux')
      expect(result.error).toContain('VITE_REPLICATE_API_KEY')
    })

    it('should return error when no API key for dalle', async () => {
      const viewPrompt = {
        view_id: 'side_profile',
        flux_optimized: 'test prompt',
        dalle_optimized: 'test prompt',
      }

      const result = await generateSingleView(viewPrompt, 'dalle')
      expect(result.status).toBe('error')
      expect(result.engine).toBe('dalle')
      expect(result.error).toContain('VITE_OPENAI_API_KEY')
    })

    it('should return error for unknown engine', async () => {
      const viewPrompt = { view_id: 'test', flux_optimized: '', dalle_optimized: '' }
      const result = await generateSingleView(viewPrompt, 'midjourney')
      expect(result.status).toBe('error')
      expect(result.error).toContain('Unknown engine')
    })

    it('should always include generation_time_ms', async () => {
      const viewPrompt = { view_id: 'test', flux_optimized: '', dalle_optimized: '' }
      const result = await generateSingleView(viewPrompt, 'flux')
      expect(result.generation_time_ms).toBeDefined()
      expect(typeof result.generation_time_ms).toBe('number')
    })
  })

  describe('generateAllViews', () => {
    it('should call onResult callback for each completed generation', async () => {
      const viewPrompts = [
        { view_id: 'three_quarter', flux_optimized: 'p1', dalle_optimized: 'p1' },
        { view_id: 'side_profile', flux_optimized: 'p2', dalle_optimized: 'p2' },
      ]

      const onResult = vi.fn()

      const results = await generateAllViews(viewPrompts, {
        engines: ['flux', 'dalle'],
        onResult,
      })

      // 2 views × 2 engines = 4 calls
      expect(onResult).toHaveBeenCalledTimes(4)
      expect(results).toHaveLength(4)
    })

    it('should launch all views in parallel (10 for 5 views × 2 engines)', async () => {
      const viewPrompts = Array.from({ length: 5 }, (_, i) => ({
        view_id: `view_${i}`,
        flux_optimized: `prompt_${i}`,
        dalle_optimized: `prompt_${i}`,
      }))

      const results = await generateAllViews(viewPrompts, {
        engines: ['flux', 'dalle'],
      })

      expect(results).toHaveLength(10)
    })

    it('should return RenderResult shape for each result', async () => {
      const viewPrompts = [
        { view_id: 'three_quarter', flux_optimized: 'p', dalle_optimized: 'p' },
      ]

      const results = await generateAllViews(viewPrompts, { engines: ['flux'] })

      expect(results[0]).toHaveProperty('view_id')
      expect(results[0]).toHaveProperty('engine')
      expect(results[0]).toHaveProperty('imageUrl')
      expect(results[0]).toHaveProperty('status')
      expect(results[0]).toHaveProperty('generation_time_ms')
      expect(results[0]).toHaveProperty('cost_usd')
    })

    it('should handle single engine option', async () => {
      const viewPrompts = [
        { view_id: 'sole', flux_optimized: 'p', dalle_optimized: 'p' },
        { view_id: 'worn', flux_optimized: 'p', dalle_optimized: 'p' },
      ]

      const results = await generateAllViews(viewPrompts, { engines: ['flux'] })
      expect(results).toHaveLength(2)
      expect(results.every((r) => r.engine === 'flux')).toBe(true)
    })

    it('all results should have error status without API keys', async () => {
      const viewPrompts = [
        { view_id: 'three_quarter', flux_optimized: 'p', dalle_optimized: 'p' },
      ]

      const results = await generateAllViews(viewPrompts, { engines: ['flux', 'dalle'] })
      expect(results.every((r) => r.status === 'error')).toBe(true)
    })
  })
})
