/**
 * Service de génération d'images dual-engine (Flux Pro + DALL-E 3)
 * Gère les 5 vues × 2 moteurs en parallèle via Promise.allSettled
 */

const FLUX_COST_USD = 0.055
const DALLE_COST_USD = 0.080
const POLL_INTERVAL_MS = 2000
const TIMEOUT_MS = 120000

/**
 * Génère toutes les vues avec tous les moteurs en parallèle
 * @param {Array<ViewPrompt>} viewPrompts - 5 ViewPrompts depuis buildViewPrompts
 * @param {object} options
 * @param {string[]} options.engines - ['flux', 'dalle']
 * @param {string} options.quality - 'standard' | 'hd'
 * @param {function} options.onResult - callback appelé à chaque résultat (pour affichage progressif)
 * @returns {Promise<Array<RenderResult>>}
 */
export async function generateAllViews(viewPrompts, options = {}) {
  const engines = options.engines || ['flux', 'dalle']
  const onResult = options.onResult || (() => {})

  const tasks = []
  for (const vp of viewPrompts) {
    for (const engine of engines) {
      tasks.push(
        generateSingleView(vp, engine, options).then((result) => {
          onResult(result)
          return result
        })
      )
    }
  }

  const settled = await Promise.allSettled(tasks)

  return settled.map((s, i) => {
    if (s.status === 'fulfilled') return s.value
    const viewIndex = Math.floor(i / engines.length)
    const engineIndex = i % engines.length
    return {
      view_id: viewPrompts[viewIndex]?.view_id || 'unknown',
      engine: engines[engineIndex],
      imageUrl: null,
      status: 'error',
      generation_time_ms: 0,
      cost_usd: 0,
      error: s.reason?.message || 'Unknown error',
    }
  })
}

/**
 * Génère une seule vue avec un seul moteur
 * @param {ViewPrompt} viewPrompt
 * @param {'flux' | 'dalle'} engine
 * @param {object} options
 * @returns {Promise<RenderResult>}
 */
export async function generateSingleView(viewPrompt, engine, options = {}) {
  const start = Date.now()

  try {
    if (engine === 'flux') {
      return await generateFlux(viewPrompt, start)
    } else if (engine === 'dalle') {
      return await generateDalle(viewPrompt, options, start)
    }
    throw new Error(`Unknown engine: ${engine}`)
  } catch (err) {
    return {
      view_id: viewPrompt.view_id,
      engine,
      imageUrl: null,
      status: 'error',
      generation_time_ms: Date.now() - start,
      cost_usd: 0,
      error: err.message,
    }
  }
}

/**
 * Génère via Flux Pro (Replicate) avec polling
 */
async function generateFlux(viewPrompt, startTime) {
  const apiKey = import.meta.env.VITE_REPLICATE_API_KEY
  if (!apiKey) {
    throw new Error('VITE_REPLICATE_API_KEY non configurée')
  }

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
          prompt: viewPrompt.flux_optimized,
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

  // Poll for result
  const deadline = startTime + TIMEOUT_MS
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
        view_id: viewPrompt.view_id,
        engine: 'flux',
        imageUrl,
        status: 'success',
        generation_time_ms: Date.now() - startTime,
        cost_usd: FLUX_COST_USD,
        error: null,
      }
    }

    if (status.status === 'failed') {
      throw new Error(status.error || 'Flux generation failed')
    }
  }

  throw new Error('Flux generation timeout (120s)')
}

/**
 * Génère via DALL-E 3 (OpenAI)
 */
async function generateDalle(viewPrompt, options, startTime) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY non configurée')
  }

  const quality = options.quality || 'hd'

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: viewPrompt.dalle_optimized,
      size: '1792x1024',
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

  return {
    view_id: viewPrompt.view_id,
    engine: 'dalle',
    imageUrl,
    status: imageUrl ? 'success' : 'error',
    generation_time_ms: Date.now() - startTime,
    cost_usd: DALLE_COST_USD,
    error: imageUrl ? null : 'No image URL in response',
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
