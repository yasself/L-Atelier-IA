/**
 * Générateur de prompts multi-vues pour la création d'images haute fidélité
 * Architecture en 6 couches × 5 vues — DALL-E 3
 */

import segments from '../data/segments'
import { montages, materiaux, INTENTION_MAP } from '../data/specs_engine'

// --- Descriptions physiques des matériaux ---
const MATERIAU_TEXTURE = {
  vachette: 'full-grain cowhide leather, smooth tight grain with natural body and resilience',
  chevreau: 'goat leather, fine-grained supple surface with delicate natural pebbling',
  agneau: 'lambskin leather, ultra-soft buttery surface with fine natural grain',
  veau: 'calfskin leather, smooth fine-pored surface with natural luster',
  nubuck: 'nubuck leather, velvety micro-abraded surface with matte finish',
  box_calf: 'box-calf leather, tight uniform grain with deep mirror polish potential',
  vachetta: 'vachetta leather, undyed vegetable-tanned surface that patinas richly over time',
  cuir_gras: 'waxed leather, oiled pull-up surface with rich depth and natural patina',
  cordovan: 'shell cordovan horse leather, dense waxy surface with deep mirror-like rolling creases',
  chevre: 'goat leather, tight pebbled grain with natural resilience and character',
  cuir_perfore: 'perforated brogue leather, decorative punch-hole patterns over fine grain',
  cuir_bicolore: 'two-tone leather, contrasting color panels with clean transition seams',
  cuir_cire: 'patent leather, high-gloss mirror finish, lacquered surface with deep reflections',
  cuir_waterproof: 'DWR-treated waterproof leather, smooth hydrophobic surface with sealed grain',
  pu: 'polyurethane synthetic, smooth uniform surface mimicking leather grain',
  microfibre: 'microfiber material, fine uniform texture with breathable finish',
  neoprene: 'neoprene fabric, smooth elastic stretch surface with modern technical look',
  mesh: 'breathable mesh textile, open-weave engineered knit pattern',
  toile: 'cotton canvas, woven textile surface with visible thread pattern',
  canvas: 'heavyweight canvas, dense woven cotton with rugged matte texture',
  denim: 'denim fabric, diagonal twill weave with indigo-dyed character',
  knit: 'engineered knit upper, seamless technical textile with sock-like fit',
  toile_enduite: 'coated canvas, waterproof sealed woven textile with smooth finish',
  nappa_vegetal: 'vegetable-tanned nappa leather, ultra-soft chrome-free surface with natural warmth',
  chevreau_vegetal: 'vegetable-tanned goat leather, soft fine grain chrome-free with gentle patina',
  coton_bio: 'organic cotton fabric, soft breathable natural weave, baby-safe',
  textile_technique: 'technical textile, engineered breathable fabric with stretch',
}

// --- Descriptions techniques des montages ---
const MONTAGE_DESCRIPTION = {
  colle: 'cemented construction, clean bonded sole edge',
  cousu_blake: 'blake stitched construction, single row of stitching visible on insole',
  cousu_goodyear: 'goodyear welted construction, prominent welt stitching around perimeter',
  cousu_strobel: 'strobel stitched construction, flexible sock-like inner sole',
  injection: 'direct injection construction, seamless molded sole-to-upper bond',
  vulcanise: 'vulcanized construction, rubber sole heat-bonded with visible foxing tape',
  strobel: 'strobel construction, athletic sock-liner bonded to upper',
  ago: 'ago moccasin construction, turned sole with soft flexible assembly',
  norwegian_welt: 'norwegian welt construction, outward-turned welt with double row of heavy stitching',
}

// --- Paramètres de lumière par vue ---
const VIEW_CONFIGS = {
  three_quarter: {
    view_id: 'three_quarter',
    view_label: 'Vue 3/4',
    priority: 1,
    lighting: 'professional product photography, 3/4 front angle, studio softbox lighting, pure white seamless background, subtle drop shadow',
    include_macro: true,
  },
  side_profile: {
    view_id: 'side_profile',
    view_label: 'Profil latéral',
    priority: 2,
    lighting: 'product photography, strict 90° lateral view, even diffused lighting, white background, no perspective distortion',
    include_macro: true,
  },
  sole: {
    view_id: 'sole',
    view_label: 'Semelle',
    priority: 3,
    lighting: 'bottom view sole photography, overhead flat lay, neutral gray background, even lighting showing sole texture and construction details',
    include_macro: false,
  },
  macro_detail: {
    view_id: 'macro_detail',
    view_label: 'Macro détail',
    priority: 4,
    lighting: 'extreme close-up macro photography, 100mm lens, shallow depth of field f/2.8, focus on leather grain texture and stitching, studio lighting raking light to reveal texture',
    include_macro: true,
  },
  worn: {
    view_id: 'worn',
    view_label: 'Portée',
    priority: 5,
    lighting: 'lifestyle photography, shoe worn on foot, neutral trouser leg visible, natural window light, white studio floor, elegant editorial style',
    include_macro: false,
  },
}

const MACRO_DETAILS = 'micro-texture of leather grain clearly visible, precision hand stitching 5 stitches per centimeter, wax-polished leather edges, subtle leather surface light reflection, sharp focus on material quality'

const QUALITY_LAYER = 'ultra high resolution, 8K, commercial product photography, photorealistic, no CGI artifacts, no plastic look, no cartoon'

const NEGATIVE_PROMPT = 'cartoon, illustration, sketch, 3D render, CGI, plastic texture, blurry, low quality, watermark, text overlay, extra shoes, deformed, unrealistic proportions, toy-like'

// --- Segment labels for English prompt ---
const SEGMENT_EN = {
  bebe: "baby infant",
  enfant: "children's",
  femme: "women's",
  homme: "men's",
}

// --- Couleur FR → EN ---
const COULEUR_EN = {
  noir: 'black', blanc: 'white', beige: 'beige', camel: 'camel',
  cognac: 'cognac brown', bordeaux: 'burgundy', marine: 'navy blue',
  kaki: 'khaki', taupe: 'taupe', gris: 'grey', rouge: 'red',
  'rose poudré': 'powder pink', nude: 'nude', or: 'gold', argent: 'silver',
  bronze: 'bronze', 'vert kaki': 'olive green', 'bleu royal': 'royal blue',
  violet: 'purple', marron: 'brown', terracotta: 'terracotta', corail: 'coral',
  multicolore: 'multicolor', bicolore: 'two-tone', tan: 'tan',
}

// --- Fermeture FR → EN ---
const FERMETURE_EN = {
  lacets: 'lace-up',
  velcro: 'velcro closure',
  scratch: 'scratch velcro strap',
  zip: 'side zip closure',
  'zip intérieur': 'hidden inner zip',
  boucle: 'single buckle monk strap, no laces',
  bride: 'ankle strap',
  'élastique': 'elastic side panel',
  elastique: 'elastic side panel',
  'monk strap': 'monk strap double buckle',
  'bouton-pression': 'snap button closure',
  'sans fermeture': 'slip-on no laces',
}

// --- Hauteur talon → EN descriptif ---
const TALON_EN = {
  plat: 'flat sole no heel',
  bas: 'low heel 2-3cm',
  mi_haut: 'mid heel 4-6cm',
  haut: 'high heel 7-9cm',
  tres_haut: 'very high heel 10-12cm',
  aiguille: 'stiletto needle-thin heel 10cm+',
}

/**
 * Construit les prompts pour les 5 vues depuis les specs enrichies
 * @param {object} specs - Résultat de enrichirProduit (specs.data contient les détails)
 * @param {string} sourcingMode - 'maroc' | 'export'
 * @returns {Array<ViewPrompt>} 5 objets ViewPrompt
 */
export function buildViewPrompts(specs, sourcingMode = 'maroc') {
  const data = specs?.data || specs || {}
  const config = specs?.config || {}

  // Extract key info
  const segment = config.segment || data.segment?.id || 'femme'
  const type = config.type_chaussure || ''
  const materiau = data.materiau_principal || config.materiau_tige || ''
  const montage = data.montage_recommande || config.montage || ''
  const couleur = config.couleur || ''
  const finitions = config.finitions || ''
  const style = config.style || ''
  const hauteurTalon = config.hauteur_talon || ''
  const fermeture = config.fermeture || ''

  // Translate fields to English — only include if translation exists
  const couleurEN = COULEUR_EN[couleur] || ''
  const fermetureEN = FERMETURE_EN[fermeture] || ''
  const talonEN = TALON_EN[hauteurTalon] || ''
  const segmentEN = SEGMENT_EN[segment] || segment

  // Lookup prompt_descriptor from INTENTION_MAP
  const intentionMatch = INTENTION_MAP[type] || data.intention
  const promptDescriptor = intentionMatch?.prompt_descriptor || null

  // MANDATORY CONTEXT LINE — first element of every prompt
  const contextParts = [
    `${segmentEN} ${promptDescriptor || type || 'shoe'}`,
    couleurEN ? `${couleurEN} color` : null,
    fermetureEN || null,
    talonEN || null,
  ].filter(Boolean)
  const contextLine = contextParts.join(', ')

  // Build the 6 layers (context line replaces old layer1)
  const layer2 = buildMaterialLayer(materiau, couleurEN)
  const layer3 = buildConstructionLayer(montage)
  const layer6 = QUALITY_LAYER

  // Build per-view prompts
  return Object.values(VIEW_CONFIGS).map((viewCfg) => {
    const layer4 = viewCfg.lighting
    const layer5 = viewCfg.include_macro ? MACRO_DETAILS : ''

    const layers = [contextLine, layer2, layer3, layer4, layer5, layer6].filter(Boolean)
    if (finitions) layers.splice(3, 0, `${finitions} finish`)
    if (style) layers.splice(1, 0, `${style} style`)

    const positive = layers.join(', ')

    return {
      view_id: viewCfg.view_id,
      view_label: viewCfg.view_label,
      positive,
      negative: NEGATIVE_PROMPT,
      flux_optimized: buildFluxPrompt(positive, materiau),
      dalle_optimized: `Generate a photorealistic product photograph of ${positive}`,
      priority: viewCfg.priority,
    }
  })
}

// --- Layer builders ---

function buildSilhouetteLayer(type, segment, promptDescriptor, hauteurTalon) {
  const segLabel = SEGMENT_EN[segment] || segment
  const heelStr = hauteurTalon ? `, ${hauteurTalon.replace(/_/g, ' ')} heel` : ''
  if (promptDescriptor) {
    return `${promptDescriptor}${heelStr}, ${segLabel} footwear`
  }
  const shoeType = type || 'shoe'
  return `${shoeType} shoe${heelStr}, ${segLabel} footwear`
}

function buildMaterialLayer(materiau, couleurEN) {
  const texture = MATERIAU_TEXTURE[materiau] || materiau || 'leather'
  const colorStr = couleurEN ? `${couleurEN} ` : ''
  return `crafted in ${colorStr}${texture}`
}

function buildConstructionLayer(montage) {
  const desc = MONTAGE_DESCRIPTION[montage]
  return desc || ''
}

/**
 * Construit un prompt optimisé pour Flux Pro (Replicate)
 * Flux Pro est plus sensible aux descriptions de texture cuir
 */
export function buildFluxPrompt(basePrompt, materiau) {
  const texture = MATERIAU_TEXTURE[materiau] || 'leather'
  const fluxPrefix = `photorealistic product shot, ${texture} texture highly detailed, visible grain pattern, specular highlights on leather surface, professional shoe photography`
  return `${fluxPrefix}, ${basePrompt}, 8k, sharp focus`
}

// --- Legacy exports for backward compatibility ---

/**
 * Legacy: génère un prompt image simple (vue 3/4 par défaut)
 */
export function genererPromptImage(config) {
  const mockSpecs = { data: {}, config }
  const views = buildViewPrompts(mockSpecs)
  const mainView = views[0]

  return {
    prompt: mainView.positive,
    parametres: {
      segment: config.segment,
      type: config.type_chaussure,
      style: config.style,
      longueur_prompt: mainView.positive.length,
    },
  }
}

/**
 * Legacy: génère un prompt textuel pour description marketing
 */
export function genererPromptDescription(config) {
  const seg = segments[config.segment]

  return `Rédige une description marketing en français pour une chaussure:
- Segment: ${seg?.label || config.segment}
- Type: ${config.type_chaussure || 'chaussure'}
- Matériau: ${config.materiau_tige || 'cuir'}
- Couleur: ${config.couleur || 'noir'}
- Style: ${config.style || 'classique'}
- Montage: ${config.montage || 'collé'}

La description doit être élégante, précise, et mettre en valeur le savoir-faire artisanal.
Maximum 3 phrases. Ton premium.`
}

/**
 * Legacy: génère des variations
 */
export function genererVariations(config, nombre = 3) {
  const mockSpecs = { data: {}, config }
  const views = buildViewPrompts(mockSpecs)

  return views.slice(0, nombre).map((v, i) => ({
    id: i + 1,
    angle: v.view_label,
    ambiance: v.view_label,
    prompt: v.positive,
  }))
}
