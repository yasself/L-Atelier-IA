import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, RotateCcw, Save } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import { getSegment } from '../data/segments'
import { getMontagesParSegment, getSemellesParSegment } from '../data/specs_engine'
import { enrichirProduit } from '../services/enrichmentService'
import { genererPromptImage } from '../services/promptBuilder'
import * as historyService from '../services/historyService'
import TechnicalCard from './TechnicalCard'
import PromptCard from './PromptCard'
import SourcingModule from './SourcingModule'

const TYPES_CHAUSSURES = {
  bebe: ['Chausson', 'Bottillon', 'Sandale', 'Basket souple'],
  enfant: ['Basket', 'Sandale', 'Bottine', 'Derby', 'Ballerine', 'Botte'],
  femme: ['Escarpin', 'Bottine', 'Sandale', 'Sneaker', 'Derby', 'Mocassin', 'Ballerine', 'Botte', 'Mule'],
  homme: ['Derby', 'Richelieu', 'Mocassin', 'Sneaker', 'Bottine', 'Chelsea', 'Monk', 'Botte'],
}

const COULEURS = ['Noir', 'Marron', 'Cognac', 'Tan', 'Bordeaux', 'Marine', 'Blanc', 'Beige', 'Gris', 'Camel', 'Kaki']
const STYLES = ['Classique', 'Sportif', 'Casual', 'Élégant', 'Bohème', 'Minimaliste', 'Urbain']

export default function Generator() {
  const { segment, config, setConfig, resetConfig, setEnrichmentResult, enrichmentResult, setGeneratedPrompt, generatedPrompt, loading, setLoading } = useAppStore()
  const [saved, setSaved] = useState(false)

  const segConfig = getSegment(segment)
  const montagesDisponibles = getMontagesParSegment(segment)
  const semellesDisponibles = getSemellesParSegment(segment)
  const types = TYPES_CHAUSSURES[segment] || []

  const handleGenerate = async () => {
    setLoading(true)
    setSaved(false)
    try {
      const enrichment = await enrichirProduit({
        segment,
        type_chaussure: config.type_chaussure,
        materiaux_souhaites: config.materiau_tige ? [config.materiau_tige] : [],
        budget: config.budget,
      })
      setEnrichmentResult(enrichment)

      const prompt = genererPromptImage({ ...config, segment })
      setGeneratedPrompt(prompt)
    } catch (err) {
      console.error('Erreur génération:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    historyService.create({
      config: { ...config, segment },
      enrichment: enrichmentResult,
      prompt: generatedPrompt,
    })
    setSaved(true)
  }

  const handleReset = () => {
    resetConfig()
    setEnrichmentResult(null)
    setGeneratedPrompt(null)
    setSaved(false)
  }

  return (
    <div className="space-y-6">
      {/* Header segment */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-noir">
            {segConfig?.label || segment}
          </h2>
          <p className="text-sm text-gray-500">
            Pointures {segConfig?.pointures.min}–{segConfig?.pointures.max} · {segConfig?.age}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-noir transition-colors"
        >
          <RotateCcw size={16} />
          Réinitialiser
        </button>
      </div>

      {/* Formulaire */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blanc rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Type de chaussure</label>
            <select
              value={config.type_chaussure}
              onChange={(e) => setConfig({ type_chaussure: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-blanc focus:outline-none focus:border-or focus:ring-1 focus:ring-or"
            >
              <option value="">Sélectionner...</option>
              {types.map((t) => <option key={t} value={t.toLowerCase()}>{t}</option>)}
            </select>
          </div>

          {/* Matériau tige */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Matériau tige</label>
            <select
              value={config.materiau_tige}
              onChange={(e) => setConfig({ materiau_tige: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-blanc focus:outline-none focus:border-or focus:ring-1 focus:ring-or"
            >
              <option value="">Sélectionner...</option>
              {(segConfig?.materiaux_recommandes.tige || []).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Couleur principale</label>
            <select
              value={config.couleur}
              onChange={(e) => setConfig({ couleur: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-blanc focus:outline-none focus:border-or focus:ring-1 focus:ring-or"
            >
              <option value="">Sélectionner...</option>
              {COULEURS.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>

          {/* Montage */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Montage</label>
            <select
              value={config.montage}
              onChange={(e) => setConfig({ montage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-blanc focus:outline-none focus:border-or focus:ring-1 focus:ring-or"
            >
              <option value="">Sélectionner...</option>
              {Object.entries(montagesDisponibles).map(([id, m]) => (
                <option key={id} value={id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Semelle */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Type de semelle</label>
            <select
              value={config.semelle_type}
              onChange={(e) => setConfig({ semelle_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-blanc focus:outline-none focus:border-or focus:ring-1 focus:ring-or"
            >
              <option value="">Sélectionner...</option>
              {Object.entries(semellesDisponibles).map(([id, s]) => (
                <option key={id} value={id}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Style</label>
            <select
              value={config.style}
              onChange={(e) => setConfig({ style: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-blanc focus:outline-none focus:border-or focus:ring-1 focus:ring-or"
            >
              <option value="">Sélectionner...</option>
              {STYLES.map((s) => <option key={s} value={s.toLowerCase()}>{s}</option>)}
            </select>
          </div>

          {/* Finitions */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Finitions & détails</label>
            <input
              type="text"
              value={config.finitions}
              onChange={(e) => setConfig({ finitions: e.target.value })}
              placeholder="Ex: surpiqûres contrastées, perforation brogue, bord franc..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-blanc focus:outline-none focus:border-or focus:ring-1 focus:ring-or"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleGenerate}
            disabled={loading || !config.type_chaussure}
            className="flex items-center gap-2 px-5 py-2.5 bg-or text-noir font-medium text-sm rounded-lg hover:bg-or-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Wand2 size={16} />
            {loading ? 'Génération...' : 'Générer la fiche'}
          </button>

          {enrichmentResult && (
            <button
              onClick={handleSave}
              disabled={saved}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
              <Save size={16} />
              {saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Résultats */}
      {enrichmentResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <TechnicalCard
            segment={segment}
            config={config}
            enrichment={enrichmentResult}
          />
          <div className="space-y-6">
            <PromptCard prompt={generatedPrompt} config={config} segment={segment} />
            <SourcingModule segment={segment} config={config} />
          </div>
        </motion.div>
      )}
    </div>
  )
}
