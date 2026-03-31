import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileImage, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import { analyzeShoeImage } from '../../services/visionService'
import useAtelierStore from '../../store/useAtelierStore'

const ACCEPT_MAP = {
  photo: 'image/jpeg,image/png,image/webp',
  pdf: 'application/pdf',
}

const PROGRESS_STEPS = [
  'Analyse en cours...',
  'Extraction des specs...',
  'Enrichissement du dictionnaire...',
]

export default function ImportModule({ mode = 'photo' }) {
  const { setVisionResult, setConfig, setSegment } = useAtelierStore()
  const [state, setState] = useState('idle') // idle | analyzing | result | error
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progressStep, setProgressStep] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const accept = mode === 'pdf' ? ACCEPT_MAP.pdf : ACCEPT_MAP.photo

  const handleFile = useCallback(async (f) => {
    if (!f) return

    // Validate size
    if (f.size > 10 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 10 MB)')
      setState('error')
      return
    }

    setFile(f)
    setState('analyzing')
    setError(null)

    // Preview for images
    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }

    // Progress simulation
    let step = 0
    const interval = setInterval(() => {
      step = Math.min(step + 1, PROGRESS_STEPS.length - 1)
      setProgressStep(step)
    }, 1500)

    try {
      const analysisResult = await analyzeShoeImage(f)
      clearInterval(interval)

      if (analysisResult.error) {
        setError(analysisResult.error)
        setState('error')
        return
      }

      setResult(analysisResult)
      setVisionResult(analysisResult)
      setState('result')

      // Pre-fill store config from extracted specs
      if (analysisResult.extractedSpecs) {
        const specs = analysisResult.extractedSpecs
        if (specs.segment) setSegment(specs.segment)
        setConfig({
          type_chaussure: specs.type || '',
          materiau_tige: specs.materials?.upper || '',
          couleur: specs.colors?.[0] || '',
          style: specs.style || '',
        })
      }
    } catch (err) {
      clearInterval(interval)
      setError(err.message || 'Erreur lors de l\'analyse')
      setState('error')
    }
  }, [setVisionResult, setConfig, setSegment])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer?.files?.[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragOver(false), [])

  const handleInputChange = useCallback((e) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleReset = () => {
    setState('idle')
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setProgressStep(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  // --- IDLE STATE ---
  if (state === 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`bg-blanc rounded-xl border-2 border-dashed p-12 text-center shadow-sm transition-colors cursor-pointer ${
          dragOver ? 'border-or bg-or/5' : 'border-border hover:border-or/50'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={40} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 font-serif text-lg mb-1">
          {mode === 'pdf' ? 'Déposez une fiche PDF' : 'Déposez une photo ou un croquis'}
        </p>
        <p className="text-gray-400 text-sm mb-4">
          {mode === 'pdf' ? 'PDF — max 10MB' : 'JPG, PNG, WebP — max 10MB'}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
          className="px-4 py-2 bg-or text-noir text-sm font-medium rounded-lg hover:bg-or-light transition-colors"
        >
          Parcourir
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </motion.div>
    )
  }

  // --- ANALYZING STATE ---
  if (state === 'analyzing') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blanc rounded-xl border border-border p-8 shadow-sm"
      >
        <div className="flex items-center gap-6">
          {preview && (
            <img src={preview} alt="Aperçu" className="w-24 h-24 object-cover rounded-lg border border-border" />
          )}
          <div className="flex-1">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <p className="text-noir font-medium">{PROGRESS_STEPS[progressStep]}</p>
            </motion.div>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-or rounded-full"
                animate={{ width: `${((progressStep + 1) / PROGRESS_STEPS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{file?.name}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  // --- ERROR STATE ---
  if (state === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blanc rounded-xl border border-red-200 p-6 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-noir font-medium text-sm">Erreur d'analyse</p>
            <p className="text-gray-500 text-sm mt-1">{error}</p>
            <button onClick={handleReset} className="text-or text-sm font-medium mt-3 hover:underline">
              Réessayer
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // --- RESULT STATE ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-blanc rounded-xl border border-border p-6 shadow-sm space-y-4"
    >
      <div className="flex items-start gap-4">
        {/* Image preview */}
        {preview && (
          <img src={preview} alt="Uploadé" className="w-28 h-28 object-cover rounded-lg border border-border shrink-0" />
        )}
        {!preview && (
          <div className="w-28 h-28 bg-gray-50 rounded-lg border border-border flex items-center justify-center shrink-0">
            <FileImage size={28} className="text-gray-300" />
          </div>
        )}

        {/* Analysis result */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-xs font-medium text-green-600">Analyse complétée</span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
              result.confidence >= 0.8 ? 'bg-green-100 text-green-700' : 'bg-or/15 text-or-dark'
            }`}>
              {Math.round(result.confidence * 100)}%
            </span>
          </div>

          <p className="text-sm text-noir leading-relaxed">
            {result.description}
          </p>

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Suggestions</p>
              <ul className="space-y-0.5">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-gray-500 flex items-start gap-1">
                    <span className="text-or mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => {
            // Trigger generation pipeline — handled by Dashboard
            useAtelierStore.getState().setActiveView('generator')
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-or text-noir font-medium text-sm rounded-lg hover:bg-or-light transition-colors"
        >
          <Sparkles size={16} />
          Générer le rendu amélioré
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 text-sm text-gray-500 hover:text-noir transition-colors"
        >
          Nouveau fichier
        </button>
      </div>
    </motion.div>
  )
}
