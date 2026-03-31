import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, RotateCcw, Save, Baby, Footprints, Sparkles, UserRound } from 'lucide-react'
import useAtelierStore from '../store/useAtelierStore'
import { getSegment, getSegmentsList, TYPES_CHAUSSURES, COULEURS, STYLES, FINITIONS, HAUTEURS_TALON, FERMETURES } from '../data/segments'
import { enrichirProduit } from '../services/enrichmentService'
import { genererPromptImage, buildViewPrompts } from '../services/promptBuilder'
import { generateAllViews } from '../services/imageService'
import useHistory from '../hooks/useHistory'
import TechnicalCard from './TechnicalCard'
import PromptCard from './PromptCard'
import SourcingModule from './SourcingModule'
import RenderGallery from './RenderGallery'

const SEGMENT_ICONS = { bebe: Baby, enfant: Footprints, femme: Sparkles, homme: UserRound }

const selectClass =
  'w-full px-3 py-2 border border-border rounded-lg text-sm bg-blanc focus:outline-none focus:border-or focus:ring-1 focus:ring-or'
const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide'

export default function Generator() {
  const {
    segment,
    setSegment,
    config,
    setConfig,
    resetConfig,
    setCurrentSpecs,
    currentSpecs,
    setCurrentPrompt,
    currentPrompt,
    setIsGenerating,
    isGenerating,
    setPrixEstime,
    setRenderStatus,
    updateSingleRender,
    resetRenders,
    renderStatus,
  } = useAtelierStore()

  const { save } = useHistory()
  const [saved, setSaved] = useState(false)

  const segConfig = getSegment(segment)
  const segmentsList = getSegmentsList()
  const types = TYPES_CHAUSSURES[segment] || []

  // Montages and semelles come from segment config (segments.js), not specs_engine
  const montagesDisponibles = segConfig?.montages_recommandes || []
  const semellesDisponibles = segConfig?.materiaux_recommandes?.semelle || []

  const handleGenerate = async () => {
    setIsGenerating(true)
    setSaved(false)
    resetRenders()
    try {
      // 1. Enrich specs
      const enrichment = await enrichirProduit({
        segment,
        type_chaussure: config.type_chaussure,
        materiaux_souhaites: config.materiau_tige ? [config.materiau_tige] : [],
        budget: config.budget,
        inspiration: config.inspiration,
      })
      setCurrentSpecs(enrichment)

      if (enrichment.gamme_prix) {
        setPrixEstime(enrichment.gamme_prix)
      } else if (segConfig?.gamme_prix_mad) {
        setPrixEstime(segConfig.gamme_prix_mad)
      }

      // 2. Build view prompts
      const specsWithConfig = { ...enrichment, config: { ...config, segment } }
      const viewPrompts = buildViewPrompts(specsWithConfig)

      // 3. Legacy prompt for PromptCard display
      const prompt = genererPromptImage({ ...config, segment })
      setCurrentPrompt({ ...prompt, viewPrompts })

      // 4. Launch image generation (parallel, progressive)
      setRenderStatus('generating')
      await generateAllViews(viewPrompts, {
        onResult: (result) => updateSingleRender(result),
      })

      // 5. Complete
      setRenderStatus('complete')
    } catch (err) {
      console.error('Erreur génération:', err)
      if (useAtelierStore.getState().renderStatus === 'generating') {
        setRenderStatus('error')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    save({
      config: { ...config, segment },
      enrichment: currentSpecs,
      prompt: currentPrompt,
      sourcingMode: useAtelierStore.getState().sourcingMode,
    })
    setSaved(true)
  }

  const handleReset = () => {
    resetConfig()
    setCurrentSpecs(null)
    setCurrentPrompt(null)
    resetRenders()
    setSaved(false)
  }

  const sourceColor =
    currentSpecs?.source === 'statique'
      ? 'bg-green-100 text-green-700'
      : 'bg-or/15 text-or-dark'

  return (
    <div className="space-y-6">
      {/* Segment selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {segmentsList.map((seg) => {
            const Icon = SEGMENT_ICONS[seg.id] || Footprints
            const isActive = segment === seg.id
            return (
              <button
                key={seg.id}
                onClick={() => { setSegment(seg.id); setSaved(false) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  isActive
                    ? 'bg-noir text-or border-noir'
                    : 'bg-blanc text-gray-500 border-border hover:border-or hover:text-noir'
                }`}
              >
                <Icon size={15} />
                {seg.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-noir transition-colors"
        >
          <RotateCcw size={16} />
          Réinitialiser
        </button>
      </div>

      {/* Subtitle */}
      {segConfig && (
        <p className="text-sm text-gray-400">
          Pointures {segConfig.pointures.min}–{segConfig.pointures.max} · {segConfig.age}
        </p>
      )}

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blanc rounded-xl border border-border p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Type */}
          <div>
            <label className={labelClass}>Type de chaussure</label>
            <select
              value={config.type_chaussure}
              onChange={(e) => setConfig({ type_chaussure: e.target.value })}
              className={selectClass}
            >
              <option value="">Sélectionner...</option>
              {types.map((t) => (
                <option key={t} value={t.toLowerCase()}>{t}</option>
              ))}
            </select>
          </div>

          {/* Matériau tige */}
          <div>
            <label className={labelClass}>Matériau tige</label>
            <select
              value={config.materiau_tige}
              onChange={(e) => setConfig({ materiau_tige: e.target.value })}
              className={selectClass}
            >
              <option value="">Sélectionner...</option>
              {(segConfig?.materiaux_recommandes?.tige || []).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Couleur */}
          <div>
            <label className={labelClass}>Couleur principale</label>
            <select
              value={config.couleur}
              onChange={(e) => setConfig({ couleur: e.target.value })}
              className={selectClass}
            >
              <option value="">Sélectionner...</option>
              {COULEURS.map((c) => (
                <option key={c} value={c.toLowerCase()}>{c}</option>
              ))}
            </select>
          </div>

          {/* Montage */}
          <div>
            <label className={labelClass}>Montage</label>
            <select
              value={config.montage}
              onChange={(e) => setConfig({ montage: e.target.value })}
              className={selectClass}
            >
              <option value="">Sélectionner...</option>
              {montagesDisponibles.map((id) => (
                <option key={id} value={id}>{id.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Semelle */}
          <div>
            <label className={labelClass}>Type de semelle</label>
            <select
              value={config.semelle_type}
              onChange={(e) => setConfig({ semelle_type: e.target.value })}
              className={selectClass}
            >
              <option value="">Sélectionner...</option>
              {semellesDisponibles.map((id) => (
                <option key={id} value={id}>{id.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div>
            <label className={labelClass}>Style</label>
            <select
              value={config.style}
              onChange={(e) => setConfig({ style: e.target.value })}
              className={selectClass}
            >
              <option value="">Sélectionner...</option>
              {STYLES.map((s) => (
                <option key={s} value={s.toLowerCase()}>{s}</option>
              ))}
            </select>
          </div>

          {/* Finition */}
          <div>
            <label className={labelClass}>Finition</label>
            <select
              value={config.finitions}
              onChange={(e) => setConfig({ finitions: e.target.value })}
              className={selectClass}
            >
              <option value="">Sélectionner...</option>
              {FINITIONS.map((f) => (
                <option key={f} value={f.toLowerCase()}>{f}</option>
              ))}
            </select>
          </div>

          {/* Hauteur de talon — Femme et Homme uniquement */}
          {(segment === 'femme' || segment === 'homme') && (
            <div>
              <label className={labelClass}>Hauteur de talon</label>
              <select
                value={config.hauteur_talon || ''}
                onChange={(e) => setConfig({ hauteur_talon: e.target.value })}
                className={selectClass}
              >
                <option value="">Sélectionner...</option>
                {HAUTEURS_TALON
                  .filter((h) => segment !== 'homme' || h.max <= 45)
                  .map((h) => (
                    <option key={h.id} value={h.id}>{h.label}</option>
                  ))}
              </select>
            </div>
          )}

          {/* Fermeture — filtrée par segment */}
          <div>
            <label className={labelClass}>Fermeture</label>
            <select
              value={config.fermeture || ''}
              onChange={(e) => setConfig({ fermeture: e.target.value })}
              className={selectClass}
            >
              <option value="">Sélectionner...</option>
              {(FERMETURES[segment] || []).map((f) => (
                <option key={f} value={f.toLowerCase()}>{f}</option>
              ))}
            </select>
          </div>

          {/* Inspiration — free text */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelClass}>Inspiration — décrivez librement la chaussure souhaitée</label>
            <textarea
              value={config.inspiration || ''}
              onChange={(e) => setConfig({ inspiration: e.target.value })}
              rows={3}
              placeholder="Ex: Derby bicolore cognac/noir, surpiqûres contrastées, semelle cousue Goodyear, allure parisienne années 40..."
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-blanc focus:outline-none focus:border-or focus:ring-1 focus:ring-or resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !config.type_chaussure}
            className="flex items-center gap-2 px-5 py-2.5 bg-or text-noir font-medium text-sm rounded-lg hover:bg-or/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Wand2 size={16} />
            {isGenerating ? 'Génération...' : 'Générer la fiche'}
          </button>

          {currentSpecs && (
            <button
              onClick={handleSave}
              disabled={saved}
              className="flex items-center gap-2 px-4 py-2.5 border border-border text-sm rounded-lg hover:bg-blanc-warm transition-colors disabled:opacity-40"
            >
              <Save size={16} />
              {saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Loading skeleton */}
      {isGenerating && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="bg-blanc rounded-xl border border-border p-6 shadow-sm space-y-3"
        >
          <div className="h-5 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </motion.div>
      )}

      {/* Results */}
      {!isGenerating && currentSpecs && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          {/* Source badge */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sourceColor}`}>
              {currentSpecs.source === 'statique'
                ? 'Statique'
                : currentSpecs.source === 'ia'
                ? 'IA'
                : 'Hybride'}
            </span>
            {currentSpecs.confiance != null && (
              <span className="text-xs text-gray-400">
                Confiance : {currentSpecs.confiance}%
              </span>
            )}
          </div>

          {/* Render Gallery */}
          <RenderGallery />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TechnicalCard
              segment={segment}
              config={config}
              enrichment={currentSpecs}
            />
            <div className="space-y-6">
              <PromptCard prompt={currentPrompt} config={config} segment={segment} enrichment={currentSpecs} />
              <SourcingModule segment={segment} config={config} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
