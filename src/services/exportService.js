/**
 * Service d'export PDF avec les 5 vues
 * Page 1 : vue Flux 3/4 pleine largeur + infos techniques
 * Page 2 : grille 2×2 des 4 autres vues
 */

/**
 * Génère un export des données de la fiche technique
 * @param {object} params
 * @param {object} params.specs - Enrichment result
 * @param {object} params.config - User configuration
 * @param {Array} params.renderResults - Array de RenderResult
 * @param {Array} params.viewPrompts - Array de ViewPrompt
 * @returns {{ pages: Array, metadata: object }}
 */
export function prepareExportData({ specs, config, renderResults, viewPrompts }) {
  const fluxResults = (renderResults || []).filter((r) => r.engine === 'flux' && r.status === 'success')
  const mainView = fluxResults.find((r) => r.view_id === 'three_quarter')
  const otherViews = fluxResults.filter((r) => r.view_id !== 'three_quarter')

  const page1 = {
    type: 'main',
    title: `Fiche Technique — ${config?.type_chaussure || 'Chaussure'}`,
    subtitle: `Segment ${config?.segment || ''} · ${config?.style || ''}`,
    mainImage: mainView?.imageUrl || null,
    specs: {
      materiau: specs?.data?.materiau_principal || config?.materiau_tige || '—',
      montage: specs?.data?.montage_recommande || config?.montage || '—',
      semelle: specs?.data?.semelle_recommandee || config?.semelle_type || '—',
      doublure: specs?.data?.doublure_recommandee || '—',
      finition: specs?.data?.finition_recommandee || config?.finitions || '—',
    },
    confiance: specs?.confiance || 0,
    source: specs?.source || '—',
  }

  const page2 = {
    type: 'gallery',
    title: 'Vues complémentaires',
    views: ['side_profile', 'macro_detail', 'sole', 'worn'].map((viewId) => {
      const result = fluxResults.find((r) => r.view_id === viewId)
      const vprompt = (viewPrompts || []).find((v) => v.view_id === viewId)
      return {
        view_id: viewId,
        label: vprompt?.view_label || viewId,
        imageUrl: result?.imageUrl || null,
      }
    }),
  }

  return {
    pages: [page1, page2],
    metadata: {
      generated_at: new Date().toISOString(),
      total_views: fluxResults.length,
      total_cost_usd: renderResults?.reduce((s, r) => s + (r.cost_usd || 0), 0) || 0,
    },
  }
}

/**
 * Télécharge les images en tant que fichiers individuels
 * @param {Array} renderResults
 */
export async function downloadAllImages(renderResults) {
  const successResults = (renderResults || []).filter((r) => r.status === 'success' && r.imageUrl)

  for (const result of successResults) {
    try {
      const response = await fetch(result.imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${result.view_id}_${result.engine}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      console.error(`Failed to download ${result.view_id}_${result.engine}`)
    }
  }
}

/**
 * Exporte la fiche technique en JSON
 */
export function exportAsJSON({ specs, config, renderResults, viewPrompts }) {
  const data = prepareExportData({ specs, config, renderResults, viewPrompts })
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fiche-technique-${config?.type_chaussure || 'export'}-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
