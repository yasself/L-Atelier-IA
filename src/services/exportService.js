/**
 * Service d'export — PDF (jsPDF) + JSON
 * Page 1 : header + visuel principal + BOM + prix
 * Page 2 : prompt positif + fournisseurs sourcing
 */

import { jsPDF } from 'jspdf'
import { getLabelFr } from '../data/specs_engine'

/**
 * Convertit une URL image en base64
 */
async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

/**
 * Génère et télécharge un PDF complet de la fiche technique
 */
export async function exportTechnicalPDF({ specs, config, renderResults, viewPrompts, reference, sourcingData }) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageW = 210
  const margin = 15
  const contentW = pageW - margin * 2
  let y = margin

  const ref = reference || `ATL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  // --- PAGE 1 ---
  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(26, 26, 26)
  doc.text("L'Atelier IA", margin, y + 6)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150)
  doc.text(ref, pageW - margin, y + 6, { align: 'right' })
  doc.text(new Date().toLocaleDateString('fr-FR'), pageW - margin, y + 11, { align: 'right' })
  y += 18

  // Title
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 26, 26)
  const type = config?.type_chaussure || 'Chaussure'
  const seg = config?.segment || ''
  doc.text(`Fiche Technique — ${type.charAt(0).toUpperCase() + type.slice(1)}`, margin, y)
  y += 5
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  doc.text(`Segment ${seg} · ${config?.style || ''}`, margin, y)
  y += 10

  // Visuel principal
  const mainResult = (renderResults || []).find(r => r.view_id === 'three_quarter' && r.status === 'success')
  if (mainResult?.imageUrl) {
    try {
      const imgData = await imageUrlToBase64(mainResult.imageUrl)
      if (imgData) {
        doc.addImage(imgData, 'PNG', margin, y, 160, 100)
        y += 105
      }
    } catch {
      doc.setFontSize(9)
      doc.setTextColor(200, 100, 100)
      doc.text('Rendu visuel non disponible — regénérer pour inclure', margin, y + 5)
      y += 12
    }
  } else {
    doc.setFontSize(9)
    doc.setTextColor(200, 100, 100)
    doc.text('Rendu visuel non disponible — regénérer pour inclure', margin, y + 5)
    y += 12
  }

  // BOM
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 26, 26)
  doc.text('Nomenclature (BOM)', margin, y)
  y += 6

  const bomItems = [
    ['Matériau tige', getLabelFr(config?.materiau_tige) || '—'],
    ['Semelle', getLabelFr(config?.semelle_type) || '—'],
    ['Montage', getLabelFr(config?.montage) || '—'],
    ['Finitions', config?.finitions || 'Non spécifiée'],
    ['Doublure', getLabelFr(specs?.data?.doublure_recommandee) || '—'],
  ]

  doc.setFontSize(9)
  for (const [label, value] of bomItems) {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 120, 120)
    doc.text(label, margin, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(26, 26, 26)
    doc.text(value, margin + 50, y)
    y += 5
  }
  y += 3

  // Prix
  const confiance = specs?.confiance || 0
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  doc.text(`Confiance : ${confiance}% · Source : ${specs?.source || '—'}`, margin, y)
  y += 8

  // Footer page 1
  doc.setFontSize(7)
  doc.setTextColor(180, 180, 180)
  doc.text("Document confidentiel — L'Atelier IA", pageW / 2, 290, { align: 'center' })

  // --- PAGE 2 ---
  doc.addPage()
  y = margin

  // Prompt positif
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 26, 26)
  doc.text('Prompt Image (positif)', margin, y)
  y += 6

  const promptText = viewPrompts?.[0]?.positive || viewPrompts?.[0]?.dalle_optimized || '—'
  doc.setFontSize(7)
  doc.setFont('courier', 'normal')
  doc.setTextColor(80, 80, 80)
  const promptLines = doc.splitTextToSize(promptText, contentW)
  doc.text(promptLines, margin, y)
  y += promptLines.length * 3.5 + 8

  // Sourcing
  if (sourcingData && sourcingData.length > 0) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(26, 26, 26)
    doc.text('Fournisseurs', margin, y)
    y += 6

    doc.setFontSize(8)
    for (const f of sourcingData.slice(0, 8)) {
      if (y > 270) break
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(26, 26, 26)
      doc.text(f.nom || f.name || '—', margin, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(120, 120, 120)
      const prix = f.prix_mad_m2 || f.prix_mad_paire || f.prix_mad_unite
      const prixStr = prix ? `${prix.min}–${prix.max} MAD` : '—'
      doc.text(`${f.ville || ''}, ${f.pays || ''} · ${prixStr} · MOQ: ${f.moq || '—'}`, margin + 55, y)
      y += 5
    }
  }

  // Footer page 2
  doc.setFontSize(7)
  doc.setTextColor(180, 180, 180)
  doc.text("Document confidentiel — L'Atelier IA", pageW / 2, 290, { align: 'center' })

  // Save
  doc.save(`${ref}-fiche.pdf`)
}

/**
 * Exporte la fiche technique en JSON
 */
export function exportAsJSON({ specs, config, renderResults, viewPrompts }) {
  const json = JSON.stringify({ specs, config, renderResults: (renderResults || []).map(r => ({ view_id: r.view_id, engine: r.engine, status: r.status, cost_usd: r.cost_usd })), viewPrompts }, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fiche-technique-${config?.type_chaussure || 'export'}-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
