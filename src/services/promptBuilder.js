/**
 * Générateur de master prompt pour la création d'images haute fidélité
 * Produit des prompts structurés pour la génération d'images de chaussures
 */

import segments from '../data/segments'
import { montages, materiaux } from '../data/specs_engine'

/**
 * Génère un prompt image haute fidélité à partir d'une configuration produit
 * @param {object} config
 * @param {string} config.segment - bebe | enfant | femme | homme
 * @param {string} config.type_chaussure - ex: 'derby', 'sneaker', 'bottine'
 * @param {string} config.materiau_tige - id du matériau
 * @param {string} config.couleur - couleur principale
 * @param {string[]} config.couleurs_secondaires - couleurs d'accent
 * @param {string} config.montage - id du montage
 * @param {string} config.semelle_type - id du type de semelle
 * @param {string} config.style - ex: 'classique', 'sportif', 'casual'
 * @param {string} config.finitions - détails de finition
 * @param {string} config.angle - angle de vue souhaité
 * @returns {{ prompt: string, parametres: object }}
 */
export function genererPromptImage(config) {
  const seg = segments[config.segment]
  const montageInfo = montages[config.montage]
  const materiauInfo = trouverMateriau(config.materiau_tige)

  const sections = [
    buildContextSection(seg, config),
    buildConstructionSection(config, montageInfo, materiauInfo),
    buildEsthetiqueSection(config),
    buildTechniqueSection(config),
    buildQualiteSection(),
  ]

  const prompt = sections.filter(Boolean).join('\n\n')

  return {
    prompt,
    parametres: {
      segment: seg?.label || config.segment,
      type: config.type_chaussure,
      style: config.style,
      longueur_prompt: prompt.length,
    },
  }
}

function buildContextSection(seg, config) {
  const pointures = seg ? `pointures ${seg.pointures.min}-${seg.pointures.max}` : ''
  return `PRODUCT: Professional footwear product photo of a ${config.type_chaussure || 'shoe'}, ${seg?.label || config.segment} segment${pointures ? ` (${pointures})` : ''}, ${config.style || 'classic'} style.`
}

function buildConstructionSection(config, montageInfo, materiauInfo) {
  const parts = ['CONSTRUCTION:']

  if (materiauInfo) {
    parts.push(`Upper material: ${materiauInfo.label}, thickness ${materiauInfo.epaisseur.min}-${materiauInfo.epaisseur.max}mm.`)
  } else if (config.materiau_tige) {
    parts.push(`Upper material: ${config.materiau_tige}.`)
  }

  if (montageInfo) {
    parts.push(`Assembly: ${montageInfo.label} (${montageInfo.description}).`)
  }

  if (config.semelle_type) {
    parts.push(`Outsole: ${config.semelle_type} material.`)
  }

  return parts.join(' ')
}

function buildEsthetiqueSection(config) {
  const parts = ['AESTHETICS:']

  if (config.couleur) {
    parts.push(`Primary color: ${config.couleur}.`)
  }
  if (config.couleurs_secondaires?.length) {
    parts.push(`Accent colors: ${config.couleurs_secondaires.join(', ')}.`)
  }
  if (config.finitions) {
    parts.push(`Finishing details: ${config.finitions}.`)
  }

  return parts.length > 1 ? parts.join(' ') : null
}

function buildTechniqueSection(config) {
  const angle = config.angle || '3/4 front view'
  return `PHOTOGRAPHY: Studio lighting, white seamless background, ${angle}, high resolution, product photography style, sharp focus on material texture and stitching details, soft shadows.`
}

function buildQualiteSection() {
  return 'QUALITY: 8K resolution, photorealistic rendering, accurate material representation, professional color calibration, no distortion, commercially viable product image.'
}

function trouverMateriau(id) {
  if (!id) return null
  for (const categorie of Object.values(materiaux)) {
    if (categorie[id]) return categorie[id]
  }
  return null
}

/**
 * Génère un prompt textuel pour description marketing
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
 * Génère des variations de prompt pour exploration créative
 */
export function genererVariations(config, nombre = 3) {
  const angles = ['3/4 front view', 'side profile view', 'top-down view', 'detail close-up of stitching', 'worn lifestyle shot']
  const ambiances = ['studio minimal', 'luxury boutique display', 'artisan workshop setting']

  const variations = []
  for (let i = 0; i < nombre; i++) {
    const variationConfig = {
      ...config,
      angle: angles[i % angles.length],
    }
    const { prompt } = genererPromptImage(variationConfig)
    variations.push({
      id: i + 1,
      angle: angles[i % angles.length],
      ambiance: ambiances[i % ambiances.length],
      prompt: prompt.replace('white seamless background', ambiances[i % ambiances.length]),
    })
  }

  return variations
}
