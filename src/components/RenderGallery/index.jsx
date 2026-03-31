import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ZoomIn, Clock, DollarSign } from 'lucide-react'
import useAtelierStore from '../../store/useAtelierStore'

const VIEW_LABELS = {
  three_quarter: 'Vue principale',
  side_profile: 'Profil',
  sole: 'Semelle',
  macro_detail: 'Détail macro',
  worn: 'Portée',
}

export default function RenderGallery() {
  const { renderResults, renderStatus, totalRenderCost } = useAtelierStore()
  const [lightbox, setLightbox] = useState(null)

  if (renderStatus === 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-blanc rounded-xl border border-border p-12 text-center shadow-sm"
      >
        <p className="text-gray-400 font-serif text-lg">Décrivez votre modèle pour générer les rendus</p>
        <p className="text-gray-300 text-sm mt-2">5 vues haute fidélité via DALL-E 3</p>
      </motion.div>
    )
  }

  const getResult = (viewId) => renderResults.find((r) => r.view_id === viewId)

  const completedCount = renderResults.filter((r) => r.status === 'success').length
  const totalExpected = 5
  const progress = Math.round((completedCount / totalExpected) * 100)

  const openLightbox = (result) => {
    if (result?.imageUrl) {
      setLightbox({
        url: result.imageUrl,
        viewId: result.view_id,
        time: result.generation_time_ms,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {/* Progress bar */}
      {(renderStatus === 'generating' || renderStatus === 'partial') && (
        <div className="bg-blanc rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Génération en cours... {completedCount}/{totalExpected}</span>
            <span className="flex items-center gap-1">
              <DollarSign size={11} />
              ${totalRenderCost.toFixed(3)} USD
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
        <div className="lg:col-span-3">
          <ViewCell viewId="three_quarter" result={getResult('three_quarter')} onZoom={openLightbox} large />
        </div>
        <div className="lg:col-span-2">
          <ViewCell viewId="side_profile" result={getResult('side_profile')} onZoom={openLightbox} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {['macro_detail', 'sole', 'worn'].map((viewId) => (
          <ViewCell key={viewId} viewId={viewId} result={getResult(viewId)} onZoom={openLightbox} />
        ))}
      </div>

      {/* Complete state */}
      {renderStatus === 'complete' && (
        <div className="flex items-center justify-between bg-blanc rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              Coût total : ${totalRenderCost.toFixed(3)} USD
            </span>
            <span>{completedCount} images générées</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-or text-noir text-sm font-medium rounded-lg hover:bg-or-light transition-colors">
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
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <div className="absolute top-4 left-4 right-16 flex items-center gap-3">
              <span className="text-white font-serif text-sm">{VIEW_LABELS[lightbox.viewId] || lightbox.viewId}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500 text-white">DALL-E 3</span>
              <span className="text-white/60 text-xs flex items-center gap-1">
                <Clock size={11} />
                {(lightbox.time / 1000).toFixed(1)}s
              </span>
            </div>
            <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
              <X size={24} />
            </button>
            <img
              src={lightbox.url}
              alt="Zoom"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ViewCell({ viewId, result, onZoom, large }) {
  const label = VIEW_LABELS[viewId] || viewId
  const isLoading = !result || result.status === 'loading'
  const hasError = result?.status === 'error'
  const hasImage = result?.status === 'success' && result.imageUrl
  const isMacro = viewId === 'macro_detail'

  return (
    <div className={`bg-blanc rounded-xl border border-border shadow-sm overflow-hidden ${large ? 'min-h-[300px]' : 'min-h-[180px]'}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">DALL-E 3</span>
      </div>

      <div className={`relative ${large ? 'h-[280px]' : 'h-[160px]'}`}>
        {isLoading && <SkeletonLoader label={label} />}

        {hasError && (
          <div className="absolute inset-0 bg-red-50/50 flex items-center justify-center p-4">
            <p className="text-xs text-red-400 text-center">{result.error}</p>
          </div>
        )}

        {hasImage && (
          <>
            <img src={result.imageUrl} alt={label} className="w-full h-full object-cover cursor-pointer" onClick={() => onZoom(result)} />
            <button className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded opacity-0 hover:opacity-100 transition-opacity" onClick={() => onZoom(result)}>
              <ZoomIn size={14} />
            </button>
            {isMacro && (
              <span className="absolute bottom-2 right-2 bg-black/50 text-white/80 text-xs px-2 py-0.5 rounded">×4 zoom simulé</span>
            )}
          </>
        )}
      </div>

      {result && result.status === 'success' && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-t border-gray-50 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Clock size={10} />{(result.generation_time_ms / 1000).toFixed(1)}s</span>
          <span className="flex items-center gap-1"><DollarSign size={10} />{(result.cost_usd * 100).toFixed(1)}¢</span>
        </div>
      )}
    </div>
  )
}

function SkeletonLoader({ label }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-2"
    >
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div className="h-full bg-or/50 rounded-full" animate={{ width: ['0%', '100%'] }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }} />
      </div>
      <p className="text-xs text-gray-300">{elapsed}s</p>
    </motion.div>
  )
}
