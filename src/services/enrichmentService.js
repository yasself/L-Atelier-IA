/**
 * Service d'enrichissement hybride
 * 1. Lookup statique dans les données locales
 * 2. Si confiance < 80%, appel Claude API en fallback
 */

import { materiaux, semelles, montages, INTENTION_MAP } from '../data/specs_engine'
import { fournisseurs } from '../data/sourcing'
import segments from '../data/segments'

/**
 * Enrichit une description produit avec les spécifications techniques
 * @param {{ segment: string, type_chaussure: string, materiaux_souhaites?: string[], budget?: string }} input
 * @returns {Promise<{ data: object, confiance: number, source: string }>}
 */
export async function enrichirProduit(input) {
  const resultatStatique = lookupStatique(input)

  if (resultatStatique.confiance >= 80) {
    return {
      data: resultatStatique.data,
      confiance: resultatStatique.confiance,
      source: 'statique',
    }
  }

  try {
    const resultatIA = await appelClaudeAPI(input, resultatStatique)
    return {
      data: { ...resultatStatique.data, ...resultatIA },
      confiance: Math.min(95, resultatStatique.confiance + 30),
      source: 'hybride',
    }
  } catch {
    return {
      data: resultatStatique.data,
      confiance: resultatStatique.confiance,
      source: 'statique (fallback)',
    }
  }
}

/**
 * Recherche statique dans les dictionnaires locaux
 */
function lookupStatique(input) {
  const { segment, type_chaussure, materiaux_souhaites } = input
  const segConfig = segments[segment]

  if (!segConfig) {
    return { data: {}, confiance: 0 }
  }

  let confiance = 40

  const data = {
    segment: segConfig,
    contraintes: segConfig.contraintes,
    normes: segConfig.normes_obligatoires,
    tests: segConfig.tests_requis,
    materiaux_recommandes: segConfig.materiaux_recommandes,
    montages_recommandes: segConfig.montages_recommandes,
  }

  // Check INTENTION_MAP for keyword matches
  const keywords = [type_chaussure, ...(input.inspiration || '').toLowerCase().split(/\s+/)].filter(Boolean)
  let bestMatch = null
  let bestConfidence = 0
  for (const keyword of keywords) {
    const match = INTENTION_MAP[keyword]
    if (match && match.confidence > bestConfidence) {
      bestMatch = match
      bestConfidence = match.confidence
    }
  }

  if (bestMatch) {
    data.intention = bestMatch
    data.materiau_principal = bestMatch.material
    data.semelle_recommandee = bestMatch.semelle
    data.montage_recommande = bestMatch.montage
    data.finition_recommandee = bestMatch.finition
    data.doublure_recommandee = bestMatch.doublure
    confiance = Math.max(confiance, Math.round(bestConfidence * 100))
  }

  // Enrichir avec les matériaux détaillés
  if (materiaux_souhaites && materiaux_souhaites.length > 0) {
    data.materiaux_details = {}
    for (const matId of materiaux_souhaites) {
      const detail = trouverMateriau(matId)
      if (detail) {
        data.materiaux_details[matId] = detail
        confiance += 10
      }
    }
  }

  // Enrichir les montages recommandés avec les détails
  data.montages_details = {}
  for (const montageId of segConfig.montages_recommandes) {
    if (montages[montageId]) {
      data.montages_details[montageId] = montages[montageId]
      confiance += 5
    }
  }

  // Enrichir les semelles
  data.semelles_details = {}
  for (const mat of segConfig.materiaux_recommandes.semelle || []) {
    if (semelles.types[mat]) {
      data.semelles_details[mat] = semelles.types[mat]
      confiance += 5
    }
  }

  // Bonus de confiance si le type de chaussure est défini
  if (type_chaussure) {
    confiance += 10
  }

  return { data, confiance: Math.min(100, confiance) }
}

/**
 * Cherche un matériau dans toutes les catégories
 */
function trouverMateriau(id) {
  for (const categorie of Object.values(materiaux)) {
    if (categorie[id]) return categorie[id]
  }
  return null
}

/**
 * Appel à l'API Claude pour enrichissement complémentaire
 * Note: nécessite une clé API configurée côté serveur/proxy
 */
async function appelClaudeAPI(input, contexteStatique) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
  if (!apiKey) {
    throw new Error('Clé API Claude non configurée (VITE_CLAUDE_API_KEY)')
  }

  const prompt = buildEnrichmentPrompt(input, contexteStatique)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`API Claude: ${response.status}`)
  }

  const result = await response.json()
  const text = result.content[0]?.text || ''

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {}
  } catch {
    return { suggestion_ia: text }
  }
}

/**
 * Construit le prompt d'enrichissement
 */
function buildEnrichmentPrompt(input, contexte) {
  return `Tu es un expert technique en chaussure. Complète cette fiche technique.

Segment: ${input.segment}
Type: ${input.type_chaussure || 'non spécifié'}
Matériaux souhaités: ${(input.materiaux_souhaites || []).join(', ') || 'non spécifiés'}
Budget: ${input.budget || 'non spécifié'}

Données existantes (confiance ${contexte.confiance}%):
${JSON.stringify(contexte.data.contraintes, null, 2)}

Réponds UNIQUEMENT en JSON avec les champs manquants:
{
  "suggestions_construction": "...",
  "finitions_recommandees": ["..."],
  "points_attention": ["..."],
  "estimation_cout_production_mad": { "min": 0, "max": 0 }
}`
}

/**
 * Recherche de fournisseurs par critères
 */
export function rechercherFournisseurs({ categorie, pays, qualite, budget_max }) {
  let results = fournisseurs[categorie] || []

  if (pays) {
    results = results.filter(f => f.pays.toLowerCase() === pays.toLowerCase())
  }
  if (qualite) {
    results = results.filter(f => f.qualite === qualite)
  }
  if (budget_max) {
    results = results.filter(f => {
      const prix = f.prix_mad_m2 || f.prix_mad_paire || f.prix_mad_unite
      return prix && prix.min <= budget_max
    })
  }

  return results
}
