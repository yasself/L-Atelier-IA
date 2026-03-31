import { describe, it, expect, beforeEach } from 'vitest'
import { enrichirProduit } from '../services/enrichmentService'
import * as historyService from '../services/historyService'
import { INTENTION_MAP, reglesParSegment } from '../data/specs_engine'
import segments from '../data/segments'

// Mock localStorage for tests
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

describe('Integration Tests — L\'Atelier IA', () => {
  describe('Test 1: Workflow Femme/escarpin', () => {
    it('should enrich femme/escarpin with high confidence from INTENTION_MAP', async () => {
      const result = await enrichirProduit({
        segment: 'femme',
        type_chaussure: 'escarpin',
      })

      // Verify structure
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('confiance')
      expect(result).toHaveProperty('source')

      // Verify confidence >= 80
      expect(result.confiance).toBeGreaterThanOrEqual(80)

      // Verify source is statique
      expect(result.source).toBe('statique')

      // Verify data is defined and has segment info
      expect(result.data).toBeDefined()
      expect(result.data.segment).toBeDefined()
      expect(result.data.segment.id).toBe('femme')

      // Verify intention from INTENTION_MAP was matched
      const escarpin = INTENTION_MAP.escarpin
      expect(escarpin.confidence).toBe(0.9)
      expect(result.data.intention).toBeDefined()
      expect(result.data.intention.material).toBe(escarpin.material)
    })
  })

  describe('Test 2: Constraint Bébé — no chrome', () => {
    it('should verify chrome VI is forbidden for bebe segment', () => {
      // Check that reglesParSegment.bebe.substances_interdites includes 'chrome VI'
      expect(reglesParSegment.bebe.substances_interdites).toContain('chrome VI')

      // Check that segments.bebe.contraintes.tannage_chrome_interdit is true
      expect(segments.bebe.contraintes.tannage_chrome_interdit).toBe(true)
    })

    it('should enrich bebe/chausson without chrome materials', async () => {
      const result = await enrichirProduit({
        segment: 'bebe',
        type_chaussure: 'chausson',
      })

      expect(result).toBeDefined()
      expect(result.confiance).toBeGreaterThan(0)

      // Verify result.data exists and is valid
      expect(result.data).toBeDefined()
      expect(result.data.segment).toBeDefined()
      expect(result.data.segment.id).toBe('bebe')

      // Verify no chrome in intention
      if (result.data.intention) {
        // Material should not contain 'chrome' in its name
        expect(result.data.intention.material).toBeDefined()
        expect(result.data.intention.material.toLowerCase()).not.toContain('chrome')
      }

      // Verify chausson from INTENTION_MAP uses safe material
      const chausson = INTENTION_MAP.chausson
      expect(chausson).toBeDefined()
      expect(chausson.material).toBe('agneau')
      // agneau is safe for bebe segment
      expect(segments.bebe.materiaux_recommandes.tige).toContain('agneau')
    })
  })

  describe('Test 3: Fallback error API', () => {
    it('should handle minimal input and provide valid fallback', async () => {
      const result = await enrichirProduit({
        segment: 'femme',
        // no type_chaussure specified
      })

      expect(result).toBeDefined()
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('confiance')
      expect(result).toHaveProperty('source')

      // Verify result has valid data
      expect(result.data).toBeDefined()
      expect(result.data.segment).toBeDefined()
      expect(result.data.segment.id).toBe('femme')

      // Source should be statique since no API key
      // confiance might be lower but still valid
      expect(result.confiance).toBeGreaterThanOrEqual(0)
      expect(result.confiance).toBeLessThanOrEqual(100)

      // Fallback should provide static data
      expect(result.source).toMatch(/statique|fallback|hybride/)
    })
  })

  describe('Test 4: History CRUD', () => {
    beforeEach(() => {
      historyService.clearAll()
      localStorageMock.clear()
    })

    it('should perform complete CRUD operations on history', () => {
      // Call clearAll first
      historyService.clearAll()
      let all = historyService.getAll()
      expect(all).toHaveLength(0)

      // Create
      const created = historyService.create({
        config: { segment: 'femme' },
        test: true,
      })

      expect(created).toBeDefined()
      expect(created.id).toBeDefined()
      expect(created.config.segment).toBe('femme')
      expect(created.test).toBe(true)
      expect(created.createdAt).toBeDefined()
      expect(created.updatedAt).toBeDefined()

      // Verify it was added
      all = historyService.getAll()
      expect(all).toHaveLength(1)
      expect(all[0].id).toBe(created.id)

      // Get by ID
      const retrieved = historyService.getById(created.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(created.id)
      expect(retrieved.config.segment).toBe('femme')

      // Remove
      const removed = historyService.remove(created.id)
      expect(removed).toBe(true)

      // Verify it was deleted
      all = historyService.getAll()
      expect(all).toHaveLength(0)

      // Verify getById returns null
      const notFound = historyService.getById(created.id)
      expect(notFound).toBeNull()
    })

    it('should handle multiple entries correctly', () => {
      historyService.clearAll()

      const entry1 = historyService.create({
        config: { segment: 'femme', type_chaussure: 'escarpin' },
      })
      const entry2 = historyService.create({
        config: { segment: 'homme', type_chaussure: 'derby' },
      })
      const entry3 = historyService.create({
        config: { segment: 'bebe', type_chaussure: 'chausson' },
      })

      let all = historyService.getAll()
      expect(all).toHaveLength(3)

      // Most recent first (unshift behavior)
      expect(all[0].id).toBe(entry3.id)
      expect(all[1].id).toBe(entry2.id)
      expect(all[2].id).toBe(entry1.id)

      // Remove middle entry
      historyService.remove(entry2.id)
      all = historyService.getAll()
      expect(all).toHaveLength(2)
      expect(all.some(e => e.id === entry1.id)).toBe(true)
      expect(all.some(e => e.id === entry3.id)).toBe(true)
      expect(all.some(e => e.id === entry2.id)).toBe(false)
    })

    it('should update entries with correct timestamps', () => {
      historyService.clearAll()

      const created = historyService.create({
        config: { segment: 'femme' },
        status: 'draft',
      })

      const createdAt = created.createdAt
      expect(createdAt).toBeDefined()

      // Wait a tiny moment to ensure timestamp difference
      const updated = historyService.update(created.id, {
        status: 'completed',
      })

      expect(updated.status).toBe('completed')
      expect(updated.createdAt).toBe(createdAt)
      // Compare ISO strings chronologically
      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(createdAt).getTime())
    })
  })

  describe('Test 5: Constraints validation', () => {
    it('should verify enfant segment constraints', () => {
      expect(reglesParSegment.enfant).toBeDefined()
      expect(reglesParSegment.enfant.substances_interdites).toContain('chrome VI')
      expect(segments.enfant.contraintes.resistance_abrasion_prioritaire).toBe(true)
      expect(segments.enfant.contraintes.montage_goodyear_interdit).toBe(true)
    })

    it('should verify homme segment allows more flexibility', () => {
      expect(reglesParSegment.homme).toBeDefined()
      expect(reglesParSegment.homme.hauteur_talon_max).toBe(45)
      expect(segments.homme.contraintes.poids_max_g).toBe(900)
      expect(reglesParSegment.homme.montages_autorises).toContain('cousu_goodyear')
    })
  })

  describe('Test 6: INTENTION_MAP coverage', () => {
    it('should have escarpin with high confidence', () => {
      expect(INTENTION_MAP.escarpin).toBeDefined()
      expect(INTENTION_MAP.escarpin.confidence).toBe(0.9)
      expect(INTENTION_MAP.escarpin.material).toBe('chevreau')
      expect(INTENTION_MAP.escarpin.finition).toBe('vernis')
    })

    it('should have chausson for bebe segment', () => {
      expect(INTENTION_MAP.chausson).toBeDefined()
      expect(INTENTION_MAP.chausson.confidence).toBe(0.92)
      expect(INTENTION_MAP.chausson.material).toBe('agneau')
      expect(INTENTION_MAP.chausson.montage).toBe('cousu_strobel')
    })

    it('should have common shoe types for all segments', () => {
      const commonTypes = ['derby', 'sneaker', 'basket', 'sandale', 'bottine']
      for (const type of commonTypes) {
        expect(INTENTION_MAP[type]).toBeDefined()
        expect(INTENTION_MAP[type].confidence).toBeGreaterThan(0)
        expect(INTENTION_MAP[type].confidence).toBeLessThanOrEqual(1)
      }
    })
  })

  describe('Test 7: Segments data integrity', () => {
    it('should have all required segments', () => {
      const requiredSegments = ['bebe', 'enfant', 'femme', 'homme']
      for (const seg of requiredSegments) {
        expect(segments[seg]).toBeDefined()
        expect(segments[seg].id).toBe(seg)
        expect(segments[seg].label).toBeDefined()
        expect(segments[seg].contraintes).toBeDefined()
        expect(segments[seg].materiaux_recommandes).toBeDefined()
        expect(segments[seg].montages_recommandes).toBeDefined()
      }
    })

    it('should have valid material recommendations for each segment', () => {
      for (const [segId, seg] of Object.entries(segments)) {
        expect(seg.materiaux_recommandes.tige).toBeDefined()
        expect(Array.isArray(seg.materiaux_recommandes.tige)).toBe(true)
        expect(seg.materiaux_recommandes.tige.length).toBeGreaterThan(0)
      }
    })
  })

  // ========= PHASE 4 — 4 SCÉNARIOS COMPLETS =========

  describe('Scénario 1 — Workflow Femme/Escarpin complet', () => {
    it('should resolve escarpin soirée with vernis and blake montage', async () => {
      const result = await enrichirProduit({
        segment: 'femme',
        type_chaussure: 'escarpin',
        inspiration: 'escarpin soirée vernis talon aiguille',
      })

      expect(result.source).toBe('statique')
      expect(result.confiance).toBeGreaterThanOrEqual(80)
      expect(result.data).toBeDefined()
      expect(result.data.intention).toBeDefined()
      expect(result.data.intention.material).toBeDefined()
      // escarpin → chevreau, finition vernis
      expect(result.data.intention.finition).toBe('vernis')
    })

    it('should have correct segment constraints for femme escarpin', () => {
      const femme = segments.femme
      expect(femme.contraintes.hauteur_talon_max_mm).toBe(120)
      expect(femme.contraintes.cambrion_obligatoire_talon_40mm).toBe(true)
      expect(femme.contraintes.cambrion_types).toContain('fibre carbone')
    })

    it('should have prix_mad gamme for femme', () => {
      const femme = segments.femme
      expect(femme.gamme_prix_mad).toBeDefined()
      expect(femme.gamme_prix_mad.entree).toBeDefined()
      expect(femme.gamme_prix_mad.premium).toBeDefined()
    })
  })

  describe('Scénario 2 — Contrainte Bébé absolue (10 inspirations)', () => {
    const bebeInspirations = [
      'confortable', 'cuir doux', 'chausson', 'premiers pas',
      'souple', 'naturel', 'coton', 'été', 'hiver', 'sport',
    ]

    it('bebe segment must forbid chrome tanning', () => {
      expect(reglesParSegment.bebe.substances_interdites).toContain('chrome VI')
      expect(segments.bebe.contraintes.tannage_chrome_interdit).toBe(true)
    })

    it('bebe segment must forbid blake and goodyear montages', () => {
      expect(reglesParSegment.bebe.montages_autorises).not.toContain('cousu_blake')
      expect(reglesParSegment.bebe.montages_autorises).not.toContain('cousu_goodyear')
    })

    it('bebe segment must have zero heel', () => {
      expect(reglesParSegment.bebe.hauteur_talon_max).toBe(0)
      expect(segments.bebe.contraintes.hauteur_talon_max_mm).toBe(0)
    })

    for (const insp of bebeInspirations) {
      it(`bebe + "${insp}" should never recommend chrome material or forbidden montage`, async () => {
        const result = await enrichirProduit({
          segment: 'bebe',
          inspiration: insp,
        })

        // Check intention material does not contain chrome
        if (result.data?.intention?.material) {
          expect(result.data.intention.material.toLowerCase()).not.toContain('chrome')
        }
        if (result.data?.materiau_principal) {
          expect(result.data.materiau_principal.toLowerCase()).not.toContain('chrome')
        }

        // Check montage is not blake/goodyear
        if (result.data?.intention?.montage) {
          expect(result.data.intention.montage).not.toBe('cousu_blake')
          expect(result.data.intention.montage).not.toBe('cousu_goodyear')
        }
        if (result.data?.montage_recommande) {
          expect(result.data.montage_recommande).not.toBe('cousu_blake')
          expect(result.data.montage_recommande).not.toBe('cousu_goodyear')
        }
      })
    }
  })

  describe('Scénario 3 — Fallback erreur API', () => {
    it('should fallback gracefully when no API key is set', async () => {
      const result = await enrichirProduit({
        segment: 'femme',
      })

      // No type_chaussure → low base confidence
      // With expanded femme montages/semelles, confidence might be high enough for static
      expect(result).toBeDefined()
      expect(result.data).toBeDefined()
      expect(result.source).toBeDefined()
      // Source should be 'statique' or 'statique (fallback)' — never crash
      expect(result.source).toMatch(/statique/)
    })

    it('should never throw even with minimal input', async () => {
      const result = await enrichirProduit({ segment: 'homme' })
      expect(result).toBeDefined()
      expect(result.confiance).toBeGreaterThan(0)
    })

    it('should fallback for completely unknown segment', async () => {
      const result = await enrichirProduit({ segment: 'alien' })
      expect(result).toBeDefined()
      // Unknown segment → confiance 0, but should not throw
      expect(result.source).toMatch(/statique/)
    })
  })

  describe('Scénario 4 — Historique bout en bout', () => {
    beforeEach(() => {
      historyService.clearAll()
    })

    it('should save, retrieve in LIFO order, delete, and clear', () => {
      const entry1 = historyService.create({ config: { segment: 'femme', type_chaussure: 'escarpin' } })
      const entry2 = historyService.create({ config: { segment: 'homme', type_chaussure: 'derby' } })

      // LIFO: entry2 should be first
      const all = historyService.getAll()
      expect(all).toHaveLength(2)
      expect(all[0].id).toBe(entry2.id)
      expect(all[1].id).toBe(entry1.id)

      // Delete entry1
      historyService.remove(entry1.id)
      const afterDelete = historyService.getAll()
      expect(afterDelete).toHaveLength(1)
      expect(afterDelete.find((e) => e.id === entry1.id)).toBeUndefined()
      expect(afterDelete[0].id).toBe(entry2.id)

      // Clear all
      historyService.clearAll()
      const afterClear = historyService.getAll()
      expect(afterClear).toHaveLength(0)
    })

    it('should maintain correct timestamps', () => {
      const entry = historyService.create({ test: true })
      expect(entry.createdAt).toBeDefined()
      expect(entry.updatedAt).toBeDefined()
      expect(new Date(entry.createdAt).getTime()).toBeGreaterThan(0)
    })
  })
})
