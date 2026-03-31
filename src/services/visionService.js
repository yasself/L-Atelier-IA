/**
 * Service d'analyse visuelle via GPT-4o Vision
 * Analyse une photo, un croquis ou un PDF de chaussure
 * et en extrait les spécifications techniques
 */

import { configService } from './configService'
import { INTENTION_MAP } from '../data/specs_engine'

const SYSTEM_PROMPT = `Tu es un expert en fabrication de chaussures de luxe. Analyse cette image et extrait toutes les informations techniques visibles : type de chaussure, matériaux apparents, construction, semelle, finitions, couleurs, style. Si c'est un croquis, interprète les intentions du designer. Réponds uniquement en JSON avec cette structure exacte :
{
  "segment": "femme" | "homme" | "enfant" | "bebe",
  "materials": { "upper": "...", "lining": "...", "sole": "..." },
  "construction": "...",
  "sole": "...",
  "finishing": "...",
  "colors": ["..."],
  "style": "...",
  "type": "...",
  "confidence": 0.0-1.0,
  "description": "...",
  "suggestions": ["..."]
}`

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * Analyse une image ou un PDF de chaussure via GPT-4o Vision
 * @param {File} file - Fichier image (jpg/png/webp) ou PDF
 * @returns {Promise<{ mode, extractedSpecs, confidence, description, suggestions }>}
 */
export async function analyzeShoeImage(file) {
  try {
    const apiKey = configService.getOpenAIKey()
    if (!apiKey) {
      throw new Error('Clé API OpenAI non configurée. Ajoutez-la dans les paramètres.')
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Fichier trop volumineux (max 10 MB)')
    }

    const mode = detectMode(file)
    const base64 = await fileToBase64(file)
    const mediaType = file.type === 'application/pdf' ? 'image/png' : file.type || 'image/jpeg'

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:${mediaType};base64,${base64}`, detail: 'high' },
              },
              {
                type: 'text',
                text: 'Analyse cette image de chaussure et extrait les spécifications techniques.',
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error?.message || `OpenAI API: ${response.status}`)
    }

    const result = await response.json()
    const text = result.choices?.[0]?.message?.content || ''

    const parsed = parseVisionResponse(text)
    const enriched = enrichWithIntentionMap(parsed)

    return {
      mode,
      extractedSpecs: enriched,
      confidence: parsed.confidence || 0.7,
      description: parsed.description || 'Analyse complétée',
      suggestions: parsed.suggestions || [],
    }
  } catch (err) {
    return {
      mode: 'photo',
      extractedSpecs: null,
      confidence: 0,
      description: '',
      suggestions: [],
      error: err.message,
    }
  }
}

function detectMode(file) {
  if (file.type === 'application/pdf') return 'pdf'
  // Heuristic: sketches tend to be larger PNGs with fewer colors
  if (file.name?.toLowerCase().includes('sketch') || file.name?.toLowerCase().includes('croquis')) {
    return 'sketch'
  }
  return 'photo'
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function parseVisionResponse(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch {
    // Parsing failed
  }
  return { description: text, confidence: 0.5 }
}

/**
 * Enrichit les specs extraites avec INTENTION_MAP
 */
function enrichWithIntentionMap(parsed) {
  const specs = {
    segment: parsed.segment || 'femme',
    materials: parsed.materials || {},
    construction: parsed.construction || '',
    sole: parsed.sole || '',
    finishing: parsed.finishing || '',
    colors: parsed.colors || [],
    style: parsed.style || '',
    type: parsed.type || '',
  }

  // Try to match type against INTENTION_MAP
  const type = specs.type?.toLowerCase()
  if (type && INTENTION_MAP[type]) {
    const match = INTENTION_MAP[type]
    if (!specs.construction) specs.construction = match.montage
    if (!specs.sole) specs.sole = match.semelle
    if (!specs.finishing) specs.finishing = match.finition
    if (!specs.materials?.lining) {
      specs.materials = { ...specs.materials, lining: match.doublure }
    }
  }

  return specs
}
