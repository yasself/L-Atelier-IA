/**
 * Tests for promptBuilder.js — 5-view layered architecture
 */

import { describe, it, expect } from 'vitest'
import {
  buildViewPrompts,
  buildFluxPrompt,
  genererPromptImage,
  genererPromptDescription,
  genererVariations,
} from '../promptBuilder'

describe('promptBuilder', () => {
  describe('buildViewPrompts', () => {
    const mockSpecs = {
      data: { materiau_principal: 'vachette', montage_recommande: 'cousu_blake' },
      config: { segment: 'femme', type_chaussure: 'bottine', couleur: 'noir', materiau_tige: 'vachette', montage: 'cousu_blake' },
    }

    it('should return exactly 5 ViewPrompts', () => {
      const result = buildViewPrompts(mockSpecs)
      expect(result).toHaveLength(5)
    })

    it('each view should have required fields', () => {
      const result = buildViewPrompts(mockSpecs)
      for (const view of result) {
        expect(view.view_id).toBeDefined()
        expect(view.view_label).toBeDefined()
        expect(view.positive).toBeDefined()
        expect(view.negative).toBeDefined()
        expect(view.dalle_optimized).toBeDefined()
        expect(view.priority).toBeDefined()
      }
    })

    it('should have correct view_ids', () => {
      const result = buildViewPrompts(mockSpecs)
      const ids = result.map(v => v.view_id)
      expect(ids).toContain('three_quarter')
      expect(ids).toContain('side_profile')
      expect(ids).toContain('sole')
      expect(ids).toContain('macro_detail')
      expect(ids).toContain('worn')
    })

    it('three_quarter should be priority 1', () => {
      const result = buildViewPrompts(mockSpecs)
      const main = result.find(v => v.view_id === 'three_quarter')
      expect(main.priority).toBe(1)
    })

    it('dalle_optimized should start with Generate instruction', () => {
      const result = buildViewPrompts(mockSpecs)
      for (const view of result) {
        expect(view.dalle_optimized).toMatch(/^Generate a photorealistic product photograph of/)
      }
    })

    it('should include 5 macro details in three_quarter view', () => {
      const result = buildViewPrompts(mockSpecs)
      const main = result.find(v => v.view_id === 'three_quarter')
      expect(main.positive).toContain('micro-texture of leather grain clearly visible')
      expect(main.positive).toContain('precision hand stitching 5 stitches per centimeter')
      expect(main.positive).toContain('wax-polished leather edges')
      expect(main.positive).toContain('subtle leather surface light reflection')
      expect(main.positive).toContain('sharp focus on material quality')
    })

    it('should NOT include macro details in sole view', () => {
      const result = buildViewPrompts(mockSpecs)
      const sole = result.find(v => v.view_id === 'sole')
      expect(sole.positive).not.toContain('micro-texture of leather grain')
    })

    it('should NOT include macro details in worn view', () => {
      const result = buildViewPrompts(mockSpecs)
      const worn = result.find(v => v.view_id === 'worn')
      expect(worn.positive).not.toContain('micro-texture of leather grain')
    })

    it('should include material texture description', () => {
      const result = buildViewPrompts(mockSpecs)
      const main = result.find(v => v.view_id === 'three_quarter')
      expect(main.positive).toContain('cowhide leather')
    })

    it('should include construction details', () => {
      const result = buildViewPrompts(mockSpecs)
      const main = result.find(v => v.view_id === 'three_quarter')
      expect(main.positive).toContain('blake stitched construction')
    })

    it('negative prompt should contain standard exclusions', () => {
      const result = buildViewPrompts(mockSpecs)
      for (const view of result) {
        expect(view.negative).toContain('cartoon')
        expect(view.negative).toContain('3D render')
        expect(view.negative).toContain('blurry')
      }
    })

    it('should include 8K and photorealistic in quality layer', () => {
      const result = buildViewPrompts(mockSpecs)
      for (const view of result) {
        expect(view.positive).toContain('8K')
        expect(view.positive).toContain('photorealistic')
      }
    })

    it('should include segment in silhouette layer', () => {
      const result = buildViewPrompts(mockSpecs)
      const main = result.find(v => v.view_id === 'three_quarter')
      expect(main.positive).toContain("women's footwear")
    })

    it('should include color when provided', () => {
      const result = buildViewPrompts(mockSpecs)
      const main = result.find(v => v.view_id === 'three_quarter')
      expect(main.positive).toContain('noir')
    })

    it('each view should have flux_optimized field', () => {
      const result = buildViewPrompts(mockSpecs)
      for (const view of result) {
        expect(view.flux_optimized).toBeDefined()
        expect(typeof view.flux_optimized).toBe('string')
        expect(view.flux_optimized.length).toBeGreaterThan(0)
      }
    })

    it('flux_optimized should contain texture terms', () => {
      const result = buildViewPrompts(mockSpecs)
      const main = result.find(v => v.view_id === 'three_quarter')
      expect(main.flux_optimized).toContain('photorealistic product shot')
      expect(main.flux_optimized).toContain('texture highly detailed')
      expect(main.flux_optimized).toContain('sharp focus')
    })
  })

  describe('buildFluxPrompt', () => {
    it('should include texture prefix and 8k sharp focus', () => {
      const result = buildFluxPrompt('test base prompt', 'vachette')
      expect(result).toContain('photorealistic product shot')
      expect(result).toContain('visible grain pattern')
      expect(result).toContain('specular highlights on leather surface')
      expect(result).toContain('8k, sharp focus')
    })

    it('should include material-specific texture', () => {
      const result = buildFluxPrompt('test', 'cordovan')
      expect(result).toContain('shell cordovan')
    })

    it('should fallback to leather for unknown material', () => {
      const result = buildFluxPrompt('test', 'unknown_material')
      expect(result).toContain('leather texture highly detailed')
    })

    it('should include the base prompt', () => {
      const result = buildFluxPrompt('my shoe description here', 'veau')
      expect(result).toContain('my shoe description here')
    })
  })

  describe('genererPromptImage (legacy)', () => {
    it('should return object with prompt and parametres', () => {
      const config = { segment: 'femme', type_chaussure: 'bottine', style: 'classique' }
      const result = genererPromptImage(config)
      expect(result.prompt).toBeDefined()
      expect(result.parametres).toBeDefined()
      expect(result.parametres.longueur_prompt).toBeGreaterThan(0)
    })

    it('should include shoe type in prompt', () => {
      const config = { segment: 'homme', type_chaussure: 'derby' }
      const result = genererPromptImage(config)
      expect(result.prompt).toContain('derby')
    })

    it('should include photorealistic in prompt', () => {
      const config = { segment: 'bebe', type_chaussure: 'chausson' }
      const result = genererPromptImage(config)
      expect(result.prompt).toContain('photorealistic')
    })
  })

  describe('genererPromptDescription', () => {
    it('should return a string', () => {
      const config = { segment: 'femme', type_chaussure: 'bottine', couleur: 'noir' }
      const result = genererPromptDescription(config)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should include segment label', () => {
      const config = { segment: 'femme', type_chaussure: 'bottine' }
      const result = genererPromptDescription(config)
      expect(result).toContain('Femme')
    })

    it('should include materiau', () => {
      const config = { segment: 'homme', materiau_tige: 'agneau' }
      const result = genererPromptDescription(config)
      expect(result).toContain('agneau')
    })
  })

  describe('genererVariations (legacy)', () => {
    it('should return array of 3 variations by default', () => {
      const config = { segment: 'femme', type_chaussure: 'bottine' }
      const result = genererVariations(config)
      expect(result).toHaveLength(3)
    })

    it('each variation should have id, angle, prompt', () => {
      const config = { segment: 'femme', type_chaussure: 'bottine' }
      const result = genererVariations(config, 2)
      for (const v of result) {
        expect(v.id).toBeDefined()
        expect(v.angle).toBeDefined()
        expect(v.prompt).toBeDefined()
      }
    })

    it('should have different angles', () => {
      const config = { segment: 'femme', type_chaussure: 'bottine' }
      const result = genererVariations(config, 3)
      const angles = result.map(v => v.angle)
      expect(angles[0]).not.toBe(angles[1])
    })
  })
})
