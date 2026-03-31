import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Image, RefreshCw } from 'lucide-react'
import { genererVariations } from '../services/promptBuilder'

export default function PromptCard({ prompt, config, segment }) {
  const [copied, setCopied] = useState(false)
  const [showVariations, setShowVariations] = useState(false)
  const [variations, setVariations] = useState([])

  if (!prompt) return null

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVariations = () => {
    if (!showVariations) {
      const v = genererVariations({ ...config, segment }, 3)
      setVariations(v)
    }
    setShowVariations(!showVariations)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-blanc rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-noir-light px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image size={16} className="text-or" />
          <h3 className="text-or font-serif text-lg">Prompt Image</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleVariations}
            className="text-gray-400 hover:text-or transition-colors p-1.5"
            title="Générer des variations"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => handleCopy(prompt.prompt)}
            className="text-gray-400 hover:text-or transition-colors p-1.5"
            title="Copier le prompt"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Prompt principal */}
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
            {prompt.prompt}
          </pre>
        </div>

        {/* Métadonnées */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(prompt.parametres).map(([key, val]) => (
            val && (
              <span key={key} className="text-xs bg-or/10 text-or-dark px-2 py-0.5 rounded">
                {key}: {val}
              </span>
            )
          ))}
        </div>

        {/* Variations */}
        {showVariations && variations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3 border-t border-gray-100 pt-4"
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Variations</p>
            {variations.map((v) => (
              <div key={v.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-or font-medium">#{v.id} — {v.angle}</span>
                  <button
                    onClick={() => handleCopy(v.prompt)}
                    className="text-gray-400 hover:text-or transition-colors"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans line-clamp-4">
                  {v.prompt}
                </pre>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
