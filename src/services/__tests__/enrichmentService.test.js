/**
 * Tests for enrichmentService.js
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { enrichirProduit, rechercherFournisseurs } from '../enrichmentService'

describe('enrichmentService', () => {
  beforeEach(() => {
    // Clear environment variables before each test
    delete import.meta.env.VITE_CLAUDE_API_KEY
  })

  describe('enrichirProduit', () => {
    it('should return source "statique" when enough data is provided (segment + type_chaussure + multiple materiaux_souhaites)', async () => {
      const input = {
        segment: 'femme',
        type_chaussure: 'derby',
        materiaux_souhaites: ['vachette', 'tr', 'eva'],
      }

      const result = await enrichirProduit(input)

      expect(result.confiance).toBeGreaterThanOrEqual(80)
      expect(result.source).toBe('statique')
      expect(result.data).toBeDefined()
      expect(result.data.segment).toBeDefined()
      expect(result.data.materiaux_details).toBeDefined()
    })

    it('should return lower confidence and fallback when minimal data is provided (just segment)', async () => {
      const input = {
        segment: 'bebe',
      }

      const result = await enrichirProduit(input)

      expect(result.confiance).toBeLessThan(80)
      expect(result.source).toBe('statique (fallback)')
      expect(result.data).toBeDefined()
      expect(result.data.segment).toBeDefined()
    })

    it('should include contraintes in data for bebe segment', async () => {
      const input = {
        segment: 'bebe',
        type_chaussure: 'chausson',
      }

      const result = await enrichirProduit(input)

      expect(result.data.contraintes).toBeDefined()
      expect(result.data.contraintes).toBeTruthy()
    })

    it('should populate materiaux_details when materiaux_souhaites are provided', async () => {
      const input = {
        segment: 'femme',
        type_chaussure: 'bottine',
        materiaux_souhaites: ['chevreau', 'tpu'],
      }

      const result = await enrichirProduit(input)

      expect(result.data.materiaux_details).toBeDefined()
      expect(Object.keys(result.data.materiaux_details).length).toBeGreaterThan(0)
    })

    it('should include montages_details in response', async () => {
      const input = {
        segment: 'homme',
        type_chaussure: 'oxford',
      }

      const result = await enrichirProduit(input)

      expect(result.data.montages_details).toBeDefined()
    })

    it('should include semelles_details in response', async () => {
      const input = {
        segment: 'enfant',
        type_chaussure: 'bottine',
      }

      const result = await enrichirProduit(input)

      expect(result.data.semelles_details).toBeDefined()
    })

    it('should return confidence 0 for unknown segment', async () => {
      const input = {
        segment: 'unknown_segment',
      }

      const result = await enrichirProduit(input)

      expect(result.confiance).toBe(0)
      expect(result.data).toEqual({})
    })

    it('should give confidence bonus when type_chaussure is provided', async () => {
      const inputWithoutType = {
        segment: 'femme',
      }

      const inputWithType = {
        segment: 'femme',
        type_chaussure: 'sneaker',
      }

      const result1 = await enrichirProduit(inputWithoutType)
      const result2 = await enrichirProduit(inputWithType)

      expect(result2.confiance).toBeGreaterThan(result1.confiance)
    })

    it('should increase confidence for each materiau found', async () => {
      const inputOne = {
        segment: 'femme',
        materiaux_souhaites: ['vachette'],
      }

      const inputTwo = {
        segment: 'femme',
        materiaux_souhaites: ['vachette', 'chevreau', 'tpu'],
      }

      const result1 = await enrichirProduit(inputOne)
      const result2 = await enrichirProduit(inputTwo)

      expect(result2.confiance).toBeGreaterThan(result1.confiance)
    })

    it('should include normes and tests in data', async () => {
      const input = {
        segment: 'enfant',
        type_chaussure: 'sneaker',
      }

      const result = await enrichirProduit(input)

      expect(result.data.normes).toBeDefined()
      expect(result.data.tests).toBeDefined()
    })
  })

  describe('rechercherFournisseurs', () => {
    it('should return results for existing category', () => {
      const results = rechercherFournisseurs({ categorie: 'cuirs' })
      expect(Array.isArray(results)).toBe(true)
    })

    it('should return empty array for non-existing category', () => {
      const results = rechercherFournisseurs({ categorie: 'non_existent' })
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(0)
    })

    it('should filter by country', () => {
      const results = rechercherFournisseurs({ categorie: 'cuirs', pays: 'maroc' })
      expect(Array.isArray(results)).toBe(true)
    })

    it('should filter by budget_max', () => {
      const results = rechercherFournisseurs({ categorie: 'cuirs', budget_max: 50 })
      expect(Array.isArray(results)).toBe(true)
    })
  })
})
