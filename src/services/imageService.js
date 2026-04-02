/**
 * Service de génération d'images — Flux Pro (primaire) + DALL-E 3 (fallback)
 * Auto-routing via configService.getBestEngine()
 */

import { configService } from './configService'

const DALLE_COST_USD = 0.080
const FLUX_COST_USD = 0.055
const POLL_INTERVAL_MS = 2000
const TIMEOUT_MS = 120000

/**
 * Génère une image — moteur choisi automatiquement
 * @param {string} masterPrompt - Prompt DALL-E
 * @param {object} options - { size, quality, fluxPrompt }
 * @returns {Promise<{ imageUrl, revisedPrompt, cost_usd, engine }>}
 */
export async function generateShoeImage(masterPrompt, options = {}) {
  const engine = configService.getBestEngine()

  if (!engine) {
    throw new Error('Aucune clé API image configurée. Ajoutez OpenAI ou Replicate dans les paramètres.')
  }

  // Flux Pro primaire avec fallback DALL-E 3
  if (engine === 'flux_pro') {
    try {
      return await generateWithFlux(options.fluxPrompt || masterPrompt, options)
    } catch {
      // Fallback silencieux vers DALL-E 3
      const openaiKey = configService.getOpenAIKey()
      if (openaiKey) {
        return await generateWithDalle(masterPrompt, options)
      }
      throw new Error('Flux Pro a échoué et aucune clé OpenAI disponible en fallback.')
    }
  }

  return await generateWithDalle(masterPrompt, options)
}

/**
 * Génère via Flux Pro (Replicate) avec polling
 */
async function generateWithFlux(prompt, options = {}) {
  const apiKey = configService.getReplicateKey()
  if (!apiKey) throw new Error('Clé Replicate non configurée')

  const start = Date.now()

  const response = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-pro/predictions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({
        input: {
          prompt,
          width: 1344,
          height: 768,
          steps: 25,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Replicate API: ${response.status}`)
  }

  const prediction = await response.json()
  const pollUrl = prediction.urls?.get || `https://api.replicate.com/v1/predictions/${prediction.id}`

  const deadline = start + TIMEOUT_MS
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS)

    const pollResponse = await fetch(pollUrl, {
      headers: { Authorization: `Token ${apiKey}` },
    })
    if (!pollResponse.ok) continue

    const status = await pollResponse.json()

    if (status.status === 'succeeded') {
      const imageUrl = Array.isArray(status.output) ? status.output[0] : status.output
      return {
        imageUrl,
        revisedPrompt: null,
        cost_usd: FLUX_COST_USD,
        engine: 'flux_pro',
        generation_time_ms: Date.now() - start,
      }
    }

    if (status.status === 'failed') {
      throw new Error(status.error || 'Flux Pro generation failed')
    }
  }

  throw new Error('Flux Pro generation timeout (120s)')
}

/**
 * Génère via DALL-E 3 (OpenAI)
 */
async function generateWithDalle(prompt, options = {}) {
  const apiKey = configService.getOpenAIKey()
  if (!apiKey) throw new Error('Clé OpenAI non configurée')

  const start = Date.now()
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
      prompt,
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

  return {
    imageUrl,
    revisedPrompt,
    cost_usd: DALLE_COST_USD,
    engine: 'dalle3',
    generation_time_ms: Date.now() - start,
  }
}

/**
 * Génère les 5 vues — séquentiel pour Flux Pro (rate limit), parallèle pour DALL-E 3
 */
export async function generateAllViews(viewPrompts, options = {}) {
  const onResult = options.onResult || (() => {})
  const sessionId = options.sessionId || null
  const engine = configService.getBestEngine()

  // Flux Pro: sequential with 3s delay between views to avoid rate limiting
  if (engine === 'flux_pro') {
    const results = []
    for (const vp of viewPrompts) {
      const result = await generateSingleView(vp, options)
      onResult(result, sessionId)
      results.push(result)
      // 3s delay between Flux calls (skip after last)
      if (vp !== viewPrompts[viewPrompts.length - 1]) {
        await sleep(3000)
      }
    }
    return results
  }

  // DALL-E 3: parallel via Promise.allSettled
  const tasks = viewPrompts.map((vp) =>
    generateSingleView(vp, options).then((result) => {
      onResult(result, sessionId)
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
      engine: engine || 'unknown',
      error: s.reason?.message || 'Unknown error',
    }
  })
}

async function generateSingleView(viewPrompt, options = {}) {
  const start = Date.now()

  try {
    const result = await generateShoeImage(
      viewPrompt.dalle_optimized,
      { ...options, fluxPrompt: viewPrompt.flux_optimized }
    )

    return {
      view_id: viewPrompt.view_id,
      imageUrl: result.imageUrl,
      revisedPrompt: result.revisedPrompt,
      status: 'success',
      generation_time_ms: result.generation_time_ms || (Date.now() - start),
      cost_usd: result.cost_usd,
      engine: result.engine,
      error: null,
    }
  } catch (err) {
    return {
      view_id: viewPrompt.view_id,
      imageUrl: null,
      status: 'error',
      generation_time_ms: Date.now() - start,
      cost_usd: 0,
      engine: configService.getBestEngine() || 'unknown',
      error: err.message,
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
