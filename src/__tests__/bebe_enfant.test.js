import { describe, it, expect, beforeEach, vi } from 'vitest'
import { enrichirProduit } from '../services/enrichmentService'
import { buildViewPrompts } from '../services/promptBuilder'
import { reglesParSegment } from '../data/specs_engine'
import segments from '../data/segments'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
if (!globalThis.localStorage) {
  Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })
}

describe('Bébé Segment Safety', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should never return chrome material for bebe', async () => {
    const result = await enrichirProduit({ segment: 'bebe', type_chaussure: 'chausson' })
    const mat = result.data?.materiau_principal || ''
    expect(mat).not.toContain('chrome')
    expect(['cuir_cire', 'cuir_gras', 'cordovan']).not.toContain(mat)
  })

  it('should never return blake/goodyear montage for bebe', async () => {
    const result = await enrichirProduit({ segment: 'bebe', type_chaussure: 'chausson' })
    const montage = result.data?.montage_recommande || ''
    expect(montage).not.toBe('cousu_blake')
    expect(montage).not.toBe('cousu_goodyear')
  })

  it('should have zero max heel height for bebe', () => {
    expect(segments.bebe.contraintes.hauteur_talon_max_mm).toBe(0)
  })

  it('bebe fermetures should not include lacets or zip', () => {
    const fermetures = segments.bebe.contraintes.fermetures
    expect(fermetures).not.toContain('lacets')
    expect(fermetures).not.toContain('zip')
  })

  it('bebe segment should forbid chrome tanning', () => {
    expect(segments.bebe.contraintes.tannage_chrome_interdit).toBe(true)
  })

  it('bebe tanningForbidden should include chrome', () => {
    expect(segments.bebe.contraintes.tanningForbidden).toContain('chrome')
  })

  it('bebe montageForbidden should include blake and goodyear', () => {
    const forbidden = segments.bebe.contraintes.montageForbidden
    expect(forbidden).toContain('cousu_blake')
    expect(forbidden).toContain('cousu_goodyear')
  })

  it('bebe should require OekoPoly certification', () => {
    expect(segments.bebe.contraintes.certificationRequise).toContain('OEKO_TEX')
  })

  it('bebe should have doublure obligatoire', () => {
    expect(segments.bebe.contraintes.doublure_obligatoire).toBe(true)
  })

  it('bebe should require oeko_tex doublure', () => {
    expect(segments.bebe.contraintes.doublure_oeko_tex_obligatoire).toBe(true)
  })

  it('bebe should forbid contrefort rigide', () => {
    expect(segments.bebe.contraintes.contrefort_rigide).toBe(false)
  })

  it('bebe should forbid bout dur', () => {
    expect(segments.bebe.contraintes.bout_dur).toBe(false)
  })

  it('bebe should require antiderapante semelle', () => {
    expect(segments.bebe.contraintes.semelle_antiderapante_obligatoire).toBe(true)
  })

  it('bebe max weight should be 80g', () => {
    expect(segments.bebe.contraintes.poids_max_g).toBe(80)
  })

  it('bebe max stem height should be 80mm', () => {
    expect(segments.bebe.contraintes.hauteur_tige_max_mm).toBe(80)
  })

  it('bebe should require very high flexibility', () => {
    expect(segments.bebe.contraintes.flexibilite).toBe('très haute')
  })

  it('bebe fermetures allowed should only be safe types', () => {
    const allowed = segments.bebe.contraintes.fermetures
    expect(allowed).toContain('scratch')
    expect(allowed).toContain('velcro')
    expect(allowed).toContain('élastique')
  })

  it('bebe should forbid vernis and patine finitions', () => {
    const forbidden = segments.bebe.contraintes.finitionsForbidden
    expect(forbidden).toContain('vernis')
    expect(forbidden).toContain('patine')
    expect(forbidden).toContain('brillant')
  })

  it('bebe safety requirements should include hypoallergenique', () => {
    expect(segments.bebe.contraintes.safetyRequirements).toContain('hypoallergenique')
  })

  it('bebe safety requirements should include non_toxique', () => {
    expect(segments.bebe.contraintes.safetyRequirements).toContain('non_toxique')
  })

  it('bebe montages should only include soft construction', () => {
    const montages = segments.bebe.montages_recommandes
    expect(montages).toContain('cousu_strobel')
    expect(montages).toContain('colle')
    expect(montages).not.toContain('cousu_goodyear')
  })

  it('bebe normes obligatoires should include EN 71-3', () => {
    expect(segments.bebe.normes_obligatoires).toContain('EN 71-3')
  })

  it('bebe normes obligatoires should include REACH', () => {
    expect(segments.bebe.normes_obligatoires).toContain('REACH Annexe XVII')
  })

  it('bebe normes obligatoires should include OEKO-TEX', () => {
    expect(segments.bebe.normes_obligatoires).toContain('OEKO-TEX Standard 100')
  })

  it('bebe tests should require flexion test > 15000 cycles', () => {
    expect(segments.bebe.tests_requis).toContain('Résistance flexion > 15 000 cycles')
  })

  it('bebe tests should require formaldehyde < 20 ppm', () => {
    expect(segments.bebe.tests_requis).toContain('Formaldéhyde < 20 ppm')
  })

  it('bebe tests should require heavy metal migration', () => {
    expect(segments.bebe.tests_requis).toContain('Migration métaux lourds')
  })

  it('bebe tests should require anti-slip test', () => {
    expect(segments.bebe.tests_requis).toContain('Test antidérapance EN ISO 13287')
  })

  it('bebe max sole thickness should be 5mm', () => {
    expect(segments.bebe.contraintes.epaisseur_semelle_max_mm).toBe(5)
  })

  it('bebe max stem thickness should be 0.8mm', () => {
    expect(segments.bebe.contraintes.epaisseur_tige_max_mm).toBe(0.8)
  })

  it('bebe enrichment should return valid confiance', async () => {
    const result = await enrichirProduit({ segment: 'bebe', type_chaussure: 'chausson' })
    expect(result.confiance).toBeGreaterThan(0)
    expect(result.confiance).toBeLessThanOrEqual(100)
  })

  it('bebe enrichment should return data object', async () => {
    const result = await enrichirProduit({ segment: 'bebe', type_chaussure: 'chausson' })
    expect(result.data).toBeDefined()
    expect(typeof result.data).toBe('object')
  })

  it('bebe enrichment should return source field', async () => {
    const result = await enrichirProduit({ segment: 'bebe', type_chaussure: 'chausson' })
    expect(result.source).toBeDefined()
    expect(['statique', 'claude']).toContain(result.source)
  })

  it('prompt for bebe should contain baby or infant keyword', () => {
    const specs = { data: {}, config: { segment: 'bebe', type_chaussure: 'chausson' } }
    const views = buildViewPrompts(specs)
    expect(views.length).toBeGreaterThan(0)
    const positive = views[0].positive.toLowerCase()
    expect(positive).toMatch(/baby|infant/)
  })

  it('prompt for bebe should contain flat sole requirement', () => {
    const specs = { data: {}, config: { segment: 'bebe', type_chaussure: 'chausson' } }
    const views = buildViewPrompts(specs)
    const p = views[0].positive.toLowerCase()
    expect(p).toMatch(/flat\s+sole|minimal\s+heel|zero\s+heel/)
  })

  it('prompt for bebe should contain non-slip safety', () => {
    const specs = { data: {}, config: { segment: 'bebe', type_chaussure: 'chausson' } }
    const views = buildViewPrompts(specs)
    const p = views[0].positive.toLowerCase()
    expect(p).toMatch(/non[\s-]?slip|antiderapant|grip/)
  })

  it('prompt for bebe should contain safety certification', () => {
    const specs = { data: {}, config: { segment: 'bebe', type_chaussure: 'chausson' } }
    const views = buildViewPrompts(specs)
    const p = views[0].positive.toLowerCase()
    expect(p).toMatch(/oeko|safe|certified/)
  })
})

describe('Enfant Segment Safety', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should never return goodyear montage for enfant', async () => {
    const result = await enrichirProduit({ segment: 'enfant', type_chaussure: 'sneaker' })
    const montage = result.data?.montage_recommande || ''
    expect(montage).not.toBe('cousu_goodyear')
  })

  it('enfant max heel should be 20mm', () => {
    expect(segments.enfant.contraintes.hauteur_talon_max_mm).toBe(20)
  })

  it('enfant montages should not include goodyear', () => {
    expect(segments.enfant.montages_recommandes).not.toContain('cousu_goodyear')
  })

  it('enfant montage_goodyear_interdit should be true', () => {
    expect(segments.enfant.contraintes.montage_goodyear_interdit).toBe(true)
  })

  it('enfant montageForbidden should include goodyear', () => {
    expect(segments.enfant.contraintes.montageForbidden).toContain('cousu_goodyear')
  })

  it('enfant should have contrefort rigide', () => {
    expect(segments.enfant.contraintes.contrefort_rigide).toBe(true)
  })

  it('enfant should have bout dur', () => {
    expect(segments.enfant.contraintes.bout_dur).toBe(true)
  })

  it('enfant should prioritize abrasion resistance', () => {
    expect(segments.enfant.contraintes.resistance_abrasion_prioritaire).toBe(true)
  })

  it('enfant anti-odeur system should be recommended', () => {
    expect(segments.enfant.contraintes.systeme_anti_odeur_recommande).toBe(true)
  })

  it('enfant tanningAllowed should include chrome_certifie', () => {
    expect(segments.enfant.contraintes.tanningAllowed).toContain('chrome_certifie')
  })

  it('enfant tanningForbidden should not allow chrome_vi', () => {
    expect(segments.enfant.contraintes.tanningForbidden).toContain('chrome_vi')
  })

  it('enfant soleRequirements should include abrasion resistance', () => {
    expect(segments.enfant.contraintes.soleRequirements).toContain('resistant_abrasion')
  })

  it('enfant max weight should be 300g', () => {
    expect(segments.enfant.contraintes.poids_max_g).toBe(300)
  })

  it('enfant max stem height should be 120mm', () => {
    expect(segments.enfant.contraintes.hauteur_tige_max_mm).toBe(120)
  })

  it('enfant max stem thickness should be 1.2mm', () => {
    expect(segments.enfant.contraintes.epaisseur_tige_max_mm).toBe(1.2)
  })

  it('enfant should require high flexibility', () => {
    expect(segments.enfant.contraintes.flexibilite).toBe('haute')
  })

  it('enfant fermetures allowed should include laces for older kids', () => {
    const allowed = segments.enfant.contraintes.fermetures
    expect(allowed).toContain('lacets')
  })

  it('enfant fermetures allowed should include zip', () => {
    expect(segments.enfant.contraintes.fermetures).toContain('zip')
  })

  it('enfant fermetures forbidden for small children should exclude zip interieur', () => {
    const forbidden = segments.enfant.contraintes.fermetures_interdites_petit_enfant
    expect(forbidden).toContain('zip intérieur')
  })

  it('enfant finitionsForbidden should include patine and antique', () => {
    const forbidden = segments.enfant.contraintes.finitionsForbidden
    expect(forbidden).toContain('patine')
    expect(forbidden).toContain('antique')
  })

  it('enfant normes obligatoires should include EN 17072', () => {
    expect(segments.enfant.normes_obligatoires).toContain('EN 17072')
  })

  it('enfant normes obligatoires should include REACH', () => {
    expect(segments.enfant.normes_obligatoires).toContain('REACH')
  })

  it('enfant doublure obligatoire should be true', () => {
    expect(segments.enfant.contraintes.doublure_obligatoire).toBe(true)
  })

  it('enfant enrichment should return valid data', async () => {
    const result = await enrichirProduit({ segment: 'enfant', type_chaussure: 'sneaker' })
    expect(result.data).toBeDefined()
    expect(typeof result.data).toBe('object')
  })

  it('enfant enrichment should return confiance metric', async () => {
    const result = await enrichirProduit({ segment: 'enfant', type_chaussure: 'sneaker' })
    expect(result.confiance).toBeGreaterThan(0)
    expect(result.confiance).toBeLessThanOrEqual(100)
  })

  it('enfant enrichment should have source field', async () => {
    const result = await enrichirProduit({ segment: 'enfant', type_chaussure: 'sneaker' })
    expect(result.source).toBeDefined()
    expect(['statique', 'claude']).toContain(result.source)
  })

  it('prompt for enfant should contain children keyword', () => {
    const specs = { data: {}, config: { segment: 'enfant', type_chaussure: 'sneaker' } }
    const views = buildViewPrompts(specs)
    expect(views.length).toBeGreaterThan(0)
    const positive = views[0].positive.toLowerCase()
    expect(positive).toMatch(/children|kid|child/)
  })

  it('prompt for enfant should contain non-slip requirement', () => {
    const specs = { data: {}, config: { segment: 'enfant', type_chaussure: 'sneaker' } }
    const views = buildViewPrompts(specs)
    const p = views[0].positive.toLowerCase()
    expect(p).toMatch(/non[\s-]?slip|antiderapant|grip/)
  })

  it('prompt for enfant should contain durable keyword', () => {
    const specs = { data: {}, config: { segment: 'enfant', type_chaussure: 'sneaker' } }
    const views = buildViewPrompts(specs)
    const p = views[0].positive.toLowerCase()
    expect(p).toMatch(/durable|robust|tough|resistant/)
  })

  it('prompt for enfant should contain abrasion-resistant', () => {
    const specs = { data: {}, config: { segment: 'enfant', type_chaussure: 'sneaker' } }
    const views = buildViewPrompts(specs)
    const p = views[0].positive.toLowerCase()
    expect(p).toMatch(/abrasion|wear[\s-]?resistant|scuff/)
  })
})

describe('Cross-Segment Safety Compliance', () => {
  it('bebe constraints should be stricter than enfant on heel height', () => {
    expect(segments.bebe.contraintes.hauteur_talon_max_mm)
      .toBeLessThan(segments.enfant.contraintes.hauteur_talon_max_mm)
  })

  it('bebe constraints should be stricter than enfant on weight', () => {
    expect(segments.bebe.contraintes.poids_max_g)
      .toBeLessThan(segments.enfant.contraintes.poids_max_g)
  })

  it('bebe constraints should be stricter than enfant on stem height', () => {
    expect(segments.bebe.contraintes.hauteur_tige_max_mm)
      .toBeLessThan(segments.enfant.contraintes.hauteur_tige_max_mm)
  })

  it('bebe should forbid chrome entirely, enfant allows certified', () => {
    const bebeAllowed = segments.bebe.contraintes.tanningAllowed
    const enfantAllowed = segments.enfant.contraintes.tanningAllowed

    expect(bebeAllowed).not.toContain('chrome')
    expect(enfantAllowed).toContain('chrome_certifie')
  })

  it('bebe should require OEKO_TEX, enfant should follow EN 17072', () => {
    expect(segments.bebe.normes_obligatoires).toContain('OEKO-TEX Standard 100')
    expect(segments.enfant.normes_obligatoires).toContain('EN 17072')
  })

  it('bebe should have more restrictive fermetures than enfant', () => {
    const bebeCount = segments.bebe.contraintes.fermetures.length
    const enfantCount = segments.enfant.contraintes.fermetures.length
    expect(bebeCount).toBeLessThan(enfantCount)
  })
})
