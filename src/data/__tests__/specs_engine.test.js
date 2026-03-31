/**
 * Tests for specs_engine.js
 */

import { describe, it, expect } from 'vitest'
import {
  materiaux,
  semelles,
  montages,
  reglesParSegment,
  getMateriauxParSegment,
  getSemellesParSegment,
  getMontagesParSegment,
  validerConfiguration,
} from '../specs_engine'

describe('specs_engine', () => {
  describe('materiaux data structure', () => {
    it('should have materiaux object with categories', () => {
      expect(materiaux).toBeDefined()
      expect(materiaux.cuir).toBeDefined()
      expect(materiaux.synthetique).toBeDefined()
      expect(materiaux.textile).toBeDefined()
    })

    it('should have epaisseur with min and max for each material', () => {
      for (const categorie of Object.values(materiaux)) {
        for (const material of Object.values(categorie)) {
          expect(material.epaisseur).toBeDefined()
          expect(material.epaisseur.min).toBeDefined()
          expect(material.epaisseur.max).toBeDefined()
          expect(material.epaisseur.min).toBeLessThanOrEqual(material.epaisseur.max)
        }
      }
    })

    it('should have vachette in cuir category', () => {
      expect(materiaux.cuir.vachette).toBeDefined()
      expect(materiaux.cuir.vachette.label).toBe('Cuir de vachette')
      expect(materiaux.cuir.vachette.epaisseur.min).toBe(1.0)
      expect(materiaux.cuir.vachette.epaisseur.max).toBe(1.6)
    })

    it('should have PU in synthetique category', () => {
      expect(materiaux.synthetique.pu).toBeDefined()
      expect(materiaux.synthetique.pu.label).toBe('PU (Polyuréthane)')
    })

    it('should have mesh in textile category', () => {
      expect(materiaux.textile.mesh).toBeDefined()
      expect(materiaux.textile.mesh.label).toBe('Mesh respirant')
    })
  })

  describe('semelles data structure', () => {
    it('should have semelles.types object', () => {
      expect(semelles.types).toBeDefined()
    })

    it('should have densite and durete_shore for each semelle type', () => {
      for (const semelle of Object.values(semelles.types)) {
        expect(semelle.densite).toBeDefined()
        expect(semelle.densite.min).toBeDefined()
        expect(semelle.densite.max).toBeDefined()
        expect(semelle.durete_shore).toBeDefined()
        expect(semelle.durete_shore.min).toBeDefined()
        expect(semelle.durete_shore.max).toBeDefined()
      }
    })

    it('should have TR semelle type with correct properties', () => {
      expect(semelles.types.tr).toBeDefined()
      expect(semelles.types.tr.label).toBe('TR (Thermoplastique Rubber)')
      expect(semelles.types.tr.densite.min).toBe(0.9)
      expect(semelles.types.tr.densite.max).toBe(1.2)
      expect(semelles.types.tr.durete_shore.echelle).toBe('A')
    })

    it('should have EVA semelle type available for all segments', () => {
      expect(semelles.types.eva).toBeDefined()
      expect(semelles.types.eva.segments).toContain('bebe')
      expect(semelles.types.eva.segments).toContain('enfant')
      expect(semelles.types.eva.segments).toContain('femme')
      expect(semelles.types.eva.segments).toContain('homme')
    })

    it('should have composants in semelles', () => {
      expect(semelles.composants).toBeDefined()
      expect(semelles.composants.premiere).toBeDefined()
      expect(Array.isArray(semelles.composants.premiere)).toBe(true)
    })
  })

  describe('montages data structure', () => {
    it('should have montages object', () => {
      expect(montages).toBeDefined()
    })

    it('should have colle montage', () => {
      expect(montages.colle).toBeDefined()
      expect(montages.colle.label).toBe('Collé (Cemented)')
      expect(montages.colle.cout_relatif).toBe(1)
    })

    it('should have cousu_goodyear montage for homme only', () => {
      expect(montages.cousu_goodyear).toBeDefined()
      expect(montages.cousu_goodyear.segments).toContain('homme')
      expect(montages.cousu_goodyear.segments).not.toContain('femme')
      expect(montages.cousu_goodyear.segments).not.toContain('bebe')
    })
  })

  describe('reglesParSegment', () => {
    it('should have rules for all 4 segments', () => {
      expect(reglesParSegment.bebe).toBeDefined()
      expect(reglesParSegment.enfant).toBeDefined()
      expect(reglesParSegment.femme).toBeDefined()
      expect(reglesParSegment.homme).toBeDefined()
    })

    it('bebe segment should have no heel (hauteur_talon_max = 0)', () => {
      expect(reglesParSegment.bebe.hauteur_talon_max).toBe(0)
    })

    it('bebe segment should exclude chrome VI', () => {
      expect(reglesParSegment.bebe.substances_interdites).toContain('chrome VI')
    })

    it('bebe segment should have very high flexibility requirement', () => {
      expect(reglesParSegment.bebe.flexibilite_min).toBe('très haute')
    })

    it('bebe segment should only allow specific montages', () => {
      expect(reglesParSegment.bebe.montages_autorises).toContain('colle')
      expect(reglesParSegment.bebe.montages_autorises).toContain('cousu_strobel')
      expect(reglesParSegment.bebe.montages_autorises).not.toContain('cousu_goodyear')
    })

    it('bebe segment should only allow EVA semelles', () => {
      expect(reglesParSegment.bebe.semelles_autorisees).toEqual(['eva'])
    })

    it('bebe segment should have weight limit of 120g', () => {
      expect(reglesParSegment.bebe.poids_max_paire).toBe(120)
    })

    it('bebe segment should have max tige thickness of 0.8mm', () => {
      expect(reglesParSegment.bebe.epaisseur_tige_max).toBe(0.8)
    })

    it('bebe segment should have strict norms', () => {
      expect(reglesParSegment.bebe.normes).toContain('EN 71-3')
      expect(reglesParSegment.bebe.normes).toContain('REACH Annexe XVII')
    })

    it('enfant segment should allow more montages than bebe', () => {
      expect(reglesParSegment.enfant.montages_autorises.length).toBeGreaterThan(
        reglesParSegment.bebe.montages_autorises.length
      )
    })

    it('homme segment should allow cousu_goodyear', () => {
      expect(reglesParSegment.homme.montages_autorises).toContain('cousu_goodyear')
    })

    it('femme segment should allow higher heel than enfant', () => {
      expect(reglesParSegment.femme.hauteur_talon_max).toBeGreaterThan(
        reglesParSegment.enfant.hauteur_talon_max
      )
    })
  })

  describe('getMateriauxParSegment', () => {
    it('should return materiaux valid for bebe segment', () => {
      const materiauxBebe = getMateriauxParSegment('bebe')
      expect(materiauxBebe).toBeDefined()
      expect(Object.keys(materiauxBebe).length).toBeGreaterThan(0)
    })

    it('should include agneau for bebe', () => {
      const materiauxBebe = getMateriauxParSegment('bebe')
      expect(materiauxBebe.cuir?.agneau).toBeDefined()
    })

    it('should not include vachette for bebe', () => {
      const materiauxBebe = getMateriauxParSegment('bebe')
      // vachette is only for femme and homme
      const hasVachette =
        materiauxBebe.cuir?.vachette !== undefined || materiauxBebe.vachette !== undefined
      expect(hasVachette).toBe(false)
    })

    it('should return different results for different segments', () => {
      const materiauxBebe = getMateriauxParSegment('bebe')
      const materiauxHomme = getMateriauxParSegment('homme')

      // homme should have more options than bebe
      expect(Object.keys(materiauxHomme).length).toBeGreaterThanOrEqual(
        Object.keys(materiauxBebe).length
      )
    })

    it('should return empty object for unknown segment', () => {
      const materiau = getMateriauxParSegment('unknown')
      expect(materiau).toEqual({})
    })
  })

  describe('getSemellesParSegment', () => {
    it('should return semelles for bebe segment', () => {
      const semellesBebe = getSemellesParSegment('bebe')
      expect(semellesBebe).toBeDefined()
      expect(semellesBebe.eva).toBeDefined()
    })

    it('bebe should only have eva semelle', () => {
      const semellesBebe = getSemellesParSegment('bebe')
      expect(Object.keys(semellesBebe)).toEqual(['eva'])
    })

    it('should return more semelle options for homme than bebe', () => {
      const semellesBebe = getSemellesParSegment('bebe')
      const semellesHomme = getSemellesParSegment('homme')

      expect(Object.keys(semellesHomme).length).toBeGreaterThan(
        Object.keys(semellesBebe).length
      )
    })

    it('should return empty object for unknown segment', () => {
      const semelles = getSemellesParSegment('unknown')
      expect(semelles).toEqual({})
    })
  })

  describe('getMontagesParSegment', () => {
    it('should return montages for bebe segment', () => {
      const montagesBebe = getMontagesParSegment('bebe')
      expect(montagesBebe).toBeDefined()
      expect(montagesBebe.colle).toBeDefined()
    })

    it('bebe should have colle and cousu_strobel', () => {
      const montagesBebe = getMontagesParSegment('bebe')
      expect(montagesBebe.colle).toBeDefined()
      expect(montagesBebe.cousu_strobel).toBeDefined()
      expect(montagesBebe.cousu_goodyear).toBeUndefined()
    })

    it('homme should have more montage options', () => {
      const montagesBebe = getMontagesParSegment('bebe')
      const montagesHomme = getMontagesParSegment('homme')

      expect(Object.keys(montagesHomme).length).toBeGreaterThan(
        Object.keys(montagesBebe).length
      )
    })

    it('should include cousu_goodyear only for homme', () => {
      const montagesBebe = getMontagesParSegment('bebe')
      const montagesHomme = getMontagesParSegment('homme')

      expect(montagesBebe.cousu_goodyear).toBeUndefined()
      expect(montagesHomme.cousu_goodyear).toBeDefined()
    })

    it('should return empty object for unknown segment', () => {
      const montages = getMontagesParSegment('unknown')
      expect(montages).toEqual({})
    })
  })

  describe('validerConfiguration', () => {
    it('should validate a valid configuration for bebe', () => {
      const config = {
        epaisseur_tige: 0.7,
        poids_paire: 100,
        hauteur_talon: 0,
        montage: 'colle',
        semelle: 'eva',
      }

      const result = validerConfiguration('bebe', config)
      expect(result.valide).toBe(true)
      expect(result.erreurs).toEqual([])
    })

    it('should reject configuration with too high tige for bebe', () => {
      const config = {
        epaisseur_tige: 1.5,
        poids_paire: 100,
        hauteur_talon: 0,
        montage: 'colle',
        semelle: 'eva',
      }

      const result = validerConfiguration('bebe', config)
      expect(result.valide).toBe(false)
      expect(result.erreurs.length).toBeGreaterThan(0)
    })

    it('should reject any heel height for bebe', () => {
      const config = {
        epaisseur_tige: 0.7,
        poids_paire: 100,
        hauteur_talon: 5,
        montage: 'colle',
        semelle: 'eva',
      }

      const result = validerConfiguration('bebe', config)
      expect(result.valide).toBe(false)
      expect(result.erreurs.some(e => e.includes('talon'))).toBe(true)
    })

    it('should reject invalid montage for bebe', () => {
      const config = {
        epaisseur_tige: 0.7,
        poids_paire: 100,
        hauteur_talon: 0,
        montage: 'cousu_goodyear',
        semelle: 'eva',
      }

      const result = validerConfiguration('bebe', config)
      expect(result.valide).toBe(false)
      expect(result.erreurs.some(e => e.includes('Montage'))).toBe(true)
    })

    it('should reject invalid semelle for bebe', () => {
      const config = {
        epaisseur_tige: 0.7,
        poids_paire: 100,
        hauteur_talon: 0,
        montage: 'colle',
        semelle: 'tr',
      }

      const result = validerConfiguration('bebe', config)
      expect(result.valide).toBe(false)
      expect(result.erreurs.some(e => e.includes('Semelle'))).toBe(true)
    })

    it('should reject weight limit for bebe', () => {
      const config = {
        epaisseur_tige: 0.7,
        poids_paire: 150,
        hauteur_talon: 0,
        montage: 'colle',
        semelle: 'eva',
      }

      const result = validerConfiguration('bebe', config)
      expect(result.valide).toBe(false)
      expect(result.erreurs.some(e => e.includes('Poids'))).toBe(true)
    })

    it('should return error for unknown segment', () => {
      const config = {
        epaisseur_tige: 0.7,
      }

      const result = validerConfiguration('unknown', config)
      expect(result.valide).toBe(false)
      expect(result.erreurs).toContain('Segment inconnu')
    })

    it('should allow valid configuration for homme', () => {
      const config = {
        epaisseur_tige: 1.8,
        poids_paire: 800,
        hauteur_talon: 40,
        montage: 'cousu_goodyear',
        semelle: 'tpu',
      }

      const result = validerConfiguration('homme', config)
      expect(result.valide).toBe(true)
      expect(result.erreurs).toEqual([])
    })

    it('should reject homme config with invalid cousu_goodyear for femme', () => {
      const config = {
        epaisseur_tige: 1.0,
        poids_paire: 500,
        hauteur_talon: 50,
        montage: 'cousu_goodyear',
        semelle: 'tpu',
      }

      const result = validerConfiguration('femme', config)
      expect(result.valide).toBe(false)
      expect(result.erreurs.some(e => e.includes('cousu_goodyear'))).toBe(true)
    })
  })
})
