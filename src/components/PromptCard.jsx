import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Image, ChevronDown, ChevronUp } from 'lucide-react'

const NEGATIVE_PROMPT =
  'low quality, blurry, distorted proportions, unrealistic materials, amateur photography, poor lighting, cartoon style, 3D render, illustration'

export default function PromptCard({ prompt, config, segment }) {
  const [copied, setCopied] = useState(false)
  const [negativeOpen, setNegativeOpen] = useState(false)

  if (!prompt) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt)
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea')
      el.value = prompt.prompt
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Quality indicators derived from prompt.parametres or sensible defaults
  const params = prompt.parametres || {}
  const qualityIndicators = [
    { label: 'Niveau de détail', value: params.detail_level || 'Haute fidélité' },
    { label: 'Éclairage', value: params.lighting || 'Studio professionnel' },
    { label: 'Angle', value: params.angle || config?.angle || '3/4 front view' },
    { label: 'Réalisme estimé', value: params.estimated_realism || '92%' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-blanc rounded-xl border border-border shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-noir px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image size={16} className="text-or" />
          <h3 className="text-or font-serif text-lg">Prompt Image</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-or/30 text-or hover:bg-or/10 transition-colors"
          title="Copier le prompt"
        >
          {copied ? (
            <>
              <Check size={13} className="text-green-400" />
              <span className="text-green-400">Copié !</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Prompt positif — monospace scrollable */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Prompt positif
          </p>
          <div className="bg-blanc-warm rounded-lg p-4 max-h-60 overflow-y-auto border border-border">
            <pre className="text-xs text-noir whitespace-pre-wrap leading-relaxed font-mono">
              {prompt.prompt}
            </pre>
          </div>
        </div>

        {/* Prompt négatif — collapsible */}
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setNegativeOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-blanc-warm hover:bg-gray-50 transition-colors text-left"
          >
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Prompt négatif
            </span>
            {negativeOpen ? (
              <ChevronUp size={14} className="text-gray-400 shrink-0" />
            ) : (
              <ChevronDown size={14} className="text-gray-400 shrink-0" />
            )}
          </button>

          <AnimatePresence>
            {negativeOpen && (
              <motion.div
                key="negative"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 border-t border-border">
                  <pre className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed font-mono">
                    {NEGATIVE_PROMPT}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quality indicators */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Indicateurs qualité
          </p>
          <div className="grid grid-cols-2 gap-2">
            {qualityIndicators.map(({ label, value }) => (
              <div key={label} className="bg-blanc-warm rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-xs font-medium text-noir mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Parametres metadata */}
        {prompt.parametres && Object.keys(prompt.parametres).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(prompt.parametres).map(([key, val]) =>
              val ? (
                <span key={key} className="text-xs bg-or/10 text-or-dark px-2 py-0.5 rounded font-mono">
                  {key}: {val}
                </span>
              ) : null
            )}
          </div>
        )}

        {/* Compatible label */}
        <p className="text-xs text-gray-400 text-center pt-1 border-t border-gray-50">
          Compatible : Midjourney · DALL-E · Flux
        </p>
      </div>
    </motion.div>
  )
}
