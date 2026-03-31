/**
 * Tests for promptBuilder.js
 */

import { describe, it, expect } from 'vitest'
import {
  genererPromptImage,
  genererPromptDescription,
  genererVariations,
} from '../promptBuilder'

describe('promptBuilder', () => {
  describe('genererPromptImage', () => {
    it('should return an object with prompt and parametres', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererPromptImage(config)

      expect(result).toBeDefined()
      expect(result.prompt).toBeDefined()
      expect(typeof result.prompt).toBe('string')
      expect(result.parametres).toBeDefined()
      expect(typeof result.parametres).toBe('object')
    })

    it('should include "Studio lighting" in prompt', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'sneaker',
        materiau_tige: 'pu',
        couleur: 'blanc',
        montage: 'injection',
        semelle_type: 'eva',
        style: 'sportif',
      }

      const result = genererPromptImage(config)
      expect(result.prompt).toContain('Studio lighting')
    })

    it('should include "sharp focus on material texture" in prompt', () => {
      const config = {
        segment: 'homme',
        type_chaussure: 'oxford',
        materiau_tige: 'chevreau',
        couleur: 'marron',
        montage: 'cousu_blake',
        semelle_type: 'cuir_semelle',
        style: 'classique',
      }

      const result = genererPromptImage(config)
      expect(result.prompt).toContain('sharp focus on material texture')
    })

    it('should include "8K resolution" in prompt', () => {
      const config = {
        segment: 'enfant',
        type_chaussure: 'sneaker',
        materiau_tige: 'mesh',
        couleur: 'bleu',
        montage: 'colle',
        semelle_type: 'eva',
        style: 'sportif',
      }

      const result = genererPromptImage(config)
      expect(result.prompt).toContain('8K resolution')
    })

    it('should include "photorealistic" in prompt', () => {
      const config = {
        segment: 'bebe',
        type_chaussure: 'chausson',
        materiau_tige: 'agneau',
        couleur: 'rose',
        montage: 'colle',
        semelle_type: 'eva',
        style: 'doux',
      }

      const result = genererPromptImage(config)
      expect(result.prompt).toContain('photorealistic')
    })

    it('should include segment label in prompt', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererPromptImage(config)
      expect(result.prompt).toContain('bottine')
    })

    it('should include material details when materiau_tige is found', () => {
      const config = {
        segment: 'homme',
        type_chaussure: 'derby',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererPromptImage(config)
      expect(result.prompt).toContain('Cuir de vachette')
    })

    it('should include colors in prompt when provided', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'sneaker',
        materiau_tige: 'pu',
        couleur: 'rouge',
        couleurs_secondaires: ['blanc', 'noir'],
        montage: 'injection',
        semelle_type: 'eva',
        style: 'sportif',
      }

      const result = genererPromptImage(config)
      expect(result.prompt).toContain('rouge')
      expect(result.prompt).toContain('blanc')
    })

    it('should include construction details', () => {
      const config = {
        segment: 'homme',
        type_chaussure: 'oxford',
        materiau_tige: 'vachette',
        couleur: 'marron',
        montage: 'cousu_blake',
        semelle_type: 'cuir_semelle',
        style: 'classique',
      }

      const result = genererPromptImage(config)
      expect(result.prompt).toContain('CONSTRUCTION:')
    })

    it('should use default angle when not provided', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererPromptImage(config)
      expect(result.prompt).toContain('3/4 front view')
    })

    it('should use custom angle when provided', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
        angle: 'side profile view',
      }

      const result = genererPromptImage(config)
      expect(result.prompt).toContain('side profile view')
    })

    it('parametres should include segment label', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererPromptImage(config)
      expect(result.parametres.segment).toBeDefined()
      expect(result.parametres.type).toBe('bottine')
      expect(result.parametres.style).toBe('classique')
    })

    it('parametres should include prompt length', () => {
      const config = {
        segment: 'homme',
        type_chaussure: 'derby',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererPromptImage(config)
      expect(result.parametres.longueur_prompt).toBeDefined()
      expect(typeof result.parametres.longueur_prompt).toBe('number')
      expect(result.parametres.longueur_prompt).toBeGreaterThan(0)
    })
  })

  describe('genererPromptDescription', () => {
    it('should return a string', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        style: 'classique',
      }

      const result = genererPromptDescription(config)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should include segment information', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        style: 'classique',
      }

      const result = genererPromptDescription(config)
      expect(result).toContain('Femme')
    })

    it('should include type_chaussure when provided', () => {
      const config = {
        segment: 'homme',
        type_chaussure: 'derby',
        materiau_tige: 'chevreau',
        couleur: 'marron',
        montage: 'cousu_blake',
        style: 'classique',
      }

      const result = genererPromptDescription(config)
      expect(result).toContain('derby')
    })

    it('should include materiau_tige when provided', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'agneau',
        couleur: 'noir',
        montage: 'colle',
        style: 'classique',
      }

      const result = genererPromptDescription(config)
      expect(result).toContain('agneau')
    })

    it('should include couleur when provided', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'bordeaux',
        montage: 'colle',
        style: 'classique',
      }

      const result = genererPromptDescription(config)
      expect(result).toContain('bordeaux')
    })

    it('should use defaults for missing parameters', () => {
      const config = {
        segment: 'enfant',
      }

      const result = genererPromptDescription(config)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
      // Should use defaults for missing fields
      expect(result).toContain('chaussure')
    })
  })

  describe('genererVariations', () => {
    it('should return array of variations', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererVariations(config)
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return 3 variations by default', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererVariations(config)
      expect(result.length).toBe(3)
    })

    it('should return correct number of variations when specified', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererVariations(config, 5)
      expect(result.length).toBe(5)
    })

    it('should have id, angle, ambiance, and prompt for each variation', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererVariations(config, 2)
      expect(result[0].id).toBeDefined()
      expect(result[0].angle).toBeDefined()
      expect(result[0].ambiance).toBeDefined()
      expect(result[0].prompt).toBeDefined()
      expect(typeof result[0].prompt).toBe('string')
    })

    it('should have different angles for each variation', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererVariations(config, 3)
      const angles = result.map(v => v.angle)
      // First 3 variations should have different angles
      expect(angles[0]).not.toBe(angles[1])
      expect(angles[1]).not.toBe(angles[2])
    })

    it('should have different ambiances for each variation', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererVariations(config, 3)
      const ambiances = result.map(v => v.ambiance)
      // First 3 variations should have different ambiances
      expect(ambiances[0]).not.toBe(ambiances[1])
      expect(ambiances[1]).not.toBe(ambiances[2])
    })

    it('should include ambiance in the prompt text', () => {
      const config = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiau_tige: 'vachette',
        couleur: 'noir',
        montage: 'colle',
        semelle_type: 'tr',
        style: 'classique',
      }

      const result = genererVariations(config, 1)
      // The prompt should contain the ambiance instead of white seamless background
      expect(result[0].prompt).toContain(result[0].ambiance)
    })

    it('should contain photography terms in all variations', () => {
      const config = {
        segment: 'homme',
        type_chaussure: 'oxford',
        materiau_tige: 'vachette',
        couleur: 'marron',
        montage: 'cousu_blake',
        semelle_type: 'cuir_semelle',
        style: 'classique',
      }

      const result = genererVariations(config, 2)
      for (const variation of result) {
        expect(variation.prompt).toContain('Studio lighting')
        expect(variation.prompt).toContain('8K resolution')
        expect(variation.prompt).toContain('photorealistic')
      }
    })
  })
})
