import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Key, Eye, EyeOff, Check, Trash2, ExternalLink } from 'lucide-react'
import { configService } from '../../services/configService'

export default function Settings() {
  const [key, setKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const hasKey = configService.hasValidConfig()

  useEffect(() => {
    const stored = configService.getOpenAIKey()
    if (stored) setKey(stored)
  }, [])

  const handleSave = () => {
    configService.setOpenAIKey(key)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
      return
    }
    configService.clearAll()
    setKey('')
    setConfirmClear(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-lg mx-auto"
    >
      <div className="bg-blanc rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-noir px-6 py-5">
          <div className="flex items-center gap-2">
            <Key size={18} className="text-or" />
            <h2 className="text-or font-serif text-xl">Votre clé API OpenAI</h2>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Nécessaire pour générer les rendus visuels et analyser vos modèles
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Link to platform */}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-or hover:text-or-dark transition-colors"
          >
            Obtenir ma clé → platform.openai.com/api-keys
            <ExternalLink size={13} />
          </a>

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              hasKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-green-500' : 'bg-red-500'}`} />
              {hasKey ? 'Configurée ✓' : 'Manquante'}
            </span>
          </div>

          {/* Input */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Clé API
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm bg-blanc font-mono focus:outline-none focus:border-or focus:ring-1 focus:ring-or"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!key || saved}
              className="flex items-center gap-2 px-5 py-2.5 bg-or text-noir font-medium text-sm rounded-lg hover:bg-or-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saved ? (
                <>
                  <Check size={16} className="text-green-600" />
                  Sauvegardé !
                </>
              ) : (
                'Sauvegarder'
              )}
            </button>

            {hasKey && (
              <button
                onClick={handleClear}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg border transition-colors ${
                  confirmClear
                    ? 'border-red-300 text-red-600 bg-red-50'
                    : 'border-border text-gray-500 hover:text-red-500 hover:border-red-200'
                }`}
              >
                <Trash2 size={14} />
                {confirmClear ? 'Confirmer la suppression' : 'Effacer'}
              </button>
            )}
          </div>

          {/* Info */}
          <p className="text-xs text-gray-400 leading-relaxed">
            Votre clé est stockée uniquement dans votre navigateur (localStorage).
            Elle n'est jamais envoyée à nos serveurs.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
