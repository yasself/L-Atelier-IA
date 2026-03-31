/**
 * Service de génération d'images — OpenAI DALL-E 3 uniquement
 * Gère les 5 vues en parallèle via Promise.allSettled
 */

import { configService } from './configService'

const DALLE_COST_USD = 0.080

/**
 * Génère une image via DALL-E 3
 * @param {string} masterPrompt - Prompt complet
 * @param {object} options - { size, quality }
 * @returns {Promise<{ imageUrl, revisedPrompt, cost_usd }>}
 */
export async function generateShoeImage(masterPrompt, options = {}) {
  const apiKey = configService.getOpenAIKey()
  if (!apiKey) {
    throw new Error('Clé API OpenAI non configurée. Ajoutez-la dans les paramètres.')
  }

  const size = options.size || '1792x1024'
  const quality = options.quality || 'hd'

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: masterPrompt,
      size,
      quality,
      n: 1,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `OpenAI API: ${response.status}`)
  }

  const result = await response.json()
  const imageUrl = result.data?.[0]?.url || null
  const revisedPrompt = result.data?.[0]?.revised_prompt || null

  if (!imageUrl) throw new Error('No image URL in response')

  return { imageUrl, revisedPrompt, cost_usd: DALLE_COST_USD }
}

/**
 * Génère les 5 vues en parallèle via DALL-E 3
 * @param {Array<ViewPrompt>} viewPrompts - 5 ViewPrompts depuis buildViewPrompts
 * @param {object} options - { onResult }
 * @returns {Promise<Array<{ view_id, imageUrl, cost_usd, error }>>}
 */
export async function generateAllViews(viewPrompts, options = {}) {
  const onResult = options.onResult || (() => {})

  const tasks = viewPrompts.map((vp) =>
    generateSingleView(vp, options).then((result) => {
      onResult(result)
      return result
    })
  )

  const settled = await Promise.allSettled(tasks)

  return settled.map((s, i) => {
    if (s.status === 'fulfilled') return s.value
    return {
      view_id: viewPrompts[i]?.view_id || 'unknown',
      imageUrl: null,
      status: 'error',
      generation_time_ms: 0,
      cost_usd: 0,
      error: s.reason?.message || 'Unknown error',
    }
  })
}

/**
 * Génère une seule vue
 */
async function generateSingleView(viewPrompt, options = {}) {
  const start = Date.now()

  try {
    const { imageUrl, revisedPrompt, cost_usd } = await generateShoeImage(
      viewPrompt.dalle_optimized,
      options
    )

    return {
      view_id: viewPrompt.view_id,
      imageUrl,
      revisedPrompt,
      status: 'success',
      generation_time_ms: Date.now() - start,
      cost_usd,
      error: null,
    }
  } catch (err) {
    return {
      view_id: viewPrompt.view_id,
      imageUrl: null,
      status: 'error',
      generation_time_ms: Date.now() - start,
      cost_usd: 0,
      error: err.message,
    }
  }
}
