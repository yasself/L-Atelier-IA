import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ZoomIn, Clock, DollarSign, Cpu } from 'lucide-react'
import useAtelierStore from '../../store/useAtelierStore'

const VIEW_ORDER = ['three_quarter', 'side_profile', 'macro_detail', 'sole', 'worn']
const VIEW_LABELS = {
  three_quarter: 'Vue 3/4',
  side_profile: 'Profil',
  macro_detail: 'Macro',
  sole: 'Semelle',
  worn: 'Portée',
}

export default function RenderGallery() {
  const { renderResults, renderStatus, totalRenderCost } = useAtelierStore()
  const [lightbox, setLightbox] = useState(null)
  const [enginePref, setEnginePref] = useState({})

  if (renderStatus === 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-blanc rounded-xl border border-border p-12 text-center shadow-sm"
      >
        <p className="text-gray-400 font-serif text-lg">Décrivez votre modèle pour générer les rendus</p>
        <p className="text-gray-300 text-sm mt-2">5 vues × 2 moteurs = 10 images haute fidélité</p>
      </motion.div>
    )
  }

  const getResult = (viewId, engine) =>
    renderResults.find((r) => r.view_id === viewId && r.engine === engine)

  const getPreferredEngine = (viewId) => enginePref[viewId] || 'flux'

  const toggleEngine = (viewId) => {
    setEnginePref((prev) => ({
      ...prev,
      [viewId]: prev[viewId] === 'dalle' ? 'flux' : 'dalle',
    }))
  }

  const completedCount = renderResults.filter((r) => r.status === 'success').length
  const totalExpected = 10
  const progress = Math.round((completedCount / totalExpected) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {/* Progress bar + cost */}
      {(renderStatus === 'generating' || renderStatus === 'partial') && (
        <div className="bg-blanc rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Génération en cours... {completedCount}/{totalExpected}</span>
            <span className="flex items-center gap-1">
              <DollarSign size={11} />
              {totalRenderCost.toFixed(3)} USD
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-or rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* Vue 3/4 — large (3 cols) */}
        <div className="lg:col-span-3">
          <ViewCell
            viewId="three_quarter"
            result={getResult('three_quarter', getPreferredEngine('three_quarter'))}
            altResult={getResult('three_quarter', getPreferredEngine('three_quarter') === 'flux' ? 'dalle' : 'flux')}
            engine={getPreferredEngine('three_quarter')}
            onToggle={() => toggleEngine('three_quarter')}
            onZoom={setLightbox}
            large
          />
        </div>

        {/* Vue profil (2 cols) */}
        <div className="lg:col-span-2">
          <ViewCell
            viewId="side_profile"
            result={getResult('side_profile', getPreferredEngine('side_profile'))}
            altResult={getResult('side_profile', getPreferredEngine('side_profile') === 'flux' ? 'dalle' : 'flux')}
            engine={getPreferredEngine('side_profile')}
            onToggle={() => toggleEngine('side_profile')}
            onZoom={setLightbox}
          />
        </div>

        {/* Bottom row: macro, sole, worn */}
        {['macro_detail', 'sole', 'worn'].map((viewId) => (
          <div key={viewId} className="lg:col-span-1 xl:col-span-1" style={{ gridColumn: 'span 1' }}>
            <ViewCell
              viewId={viewId}
              result={getResult(viewId, getPreferredEngine(viewId))}
              altResult={getResult(viewId, getPreferredEngine(viewId) === 'flux' ? 'dalle' : 'flux')}
              engine={getPreferredEngine(viewId)}
              onToggle={() => toggleEngine(viewId)}
              onZoom={setLightbox}
            />
          </div>
        ))}
      </div>

      {/* Bottom row fix for 3 small cells */}
      <style>{`.grid > div:nth-child(n+3):nth-child(-n+5) { grid-column: span 1; }`}</style>

      {/* Complete state: cost + download */}
      {renderStatus === 'complete' && (
        <div className="flex items-center justify-between bg-blanc rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              Coût total : {totalRenderCost.toFixed(3)} USD
            </span>
            <span>{completedCount} images générées</span>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-or text-noir text-sm font-medium rounded-lg hover:bg-or-light transition-colors"
            onClick={() => {/* TODO: zip download */}}
          >
            <Download size={14} />
            Tout télécharger
          </button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X size={24} />
            </button>
            <img
              src={lightbox}
              alt="Zoom"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ViewCell({ viewId, result, altResult, engine, onToggle, onZoom, large }) {
  const label = VIEW_LABELS[viewId] || viewId
  const isLoading = !result || result.status === 'loading'
  const hasError = result?.status === 'error'
  const hasImage = result?.status === 'success' && result.imageUrl

  return (
    <div className={`bg-blanc rounded-xl border border-border shadow-sm overflow-hidden ${large ? 'min-h-[300px]' : 'min-h-[180px]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggle}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${
              engine === 'flux' ? 'bg-or/15 text-or-dark font-medium' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Flux
          </button>
          <button
            onClick={onToggle}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${
              engine === 'dalle' ? 'bg-or/15 text-or-dark font-medium' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            DALL-E
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`relative ${large ? 'h-[280px]' : 'h-[160px]'}`}>
        {isLoading && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-gray-50 flex items-center justify-center"
          >
            <div className="text-xs text-gray-400">Génération...</div>
          </motion.div>
        )}

        {hasError && (
          <div className="absolute inset-0 bg-red-50/50 flex items-center justify-center p-4">
            <p className="text-xs text-red-400 text-center">{result.error}</p>
          </div>
        )}

        {hasImage && (
          <>
            <img
              src={result.imageUrl}
              alt={`${label} - ${engine}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onZoom(result.imageUrl)}
            />
            <button
              className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => onZoom(result.imageUrl)}
            >
              <ZoomIn size={14} />
            </button>
          </>
        )}
      </div>

      {/* Footer badges */}
      {result && result.status === 'success' && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-t border-gray-50 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Cpu size={10} />
            {engine === 'flux' ? 'Flux Pro' : 'DALL-E 3'}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {(result.generation_time_ms / 1000).toFixed(1)}s
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={10} />
            {(result.cost_usd * 100).toFixed(1)}¢
          </span>
        </div>
      )}
    </div>
  )
}
