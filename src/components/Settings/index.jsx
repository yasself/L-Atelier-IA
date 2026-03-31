import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Key, Eye, EyeOff, Check, Trash2, ExternalLink } from 'lucide-react'
import { configService } from '../../services/configService'

export default function Settings() {
  const [openaiKey, setOpenaiKey] = useState('')
  const [replicateKey, setReplicateKey] = useState('')
  const [showOpenai, setShowOpenai] = useState(false)
  const [showReplicate, setShowReplicate] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const hasOpenai = Boolean(configService.getOpenAIKey()?.length > 10)
  const hasReplicate = Boolean(configService.getReplicateKey()?.length > 10)

  useEffect(() => {
    const storedOpenai = configService.getOpenAIKey()
    const storedReplicate = configService.getReplicateKey()
    if (storedOpenai) setOpenaiKey(storedOpenai)
    if (storedReplicate) setReplicateKey(storedReplicate)
  }, [])

  const handleSave = () => {
    configService.setOpenAIKey(openaiKey)
    configService.setReplicateKey(replicateKey)
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
    setOpenaiKey('')
    setReplicateKey('')
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
            <h2 className="text-or font-serif text-xl">Clés API</h2>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Nécessaires pour générer les rendus visuels et analyser vos modèles
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* OpenAI Key */}
          <KeyField
            label="OpenAI (DALL-E 3 + GPT-4o Vision)"
            linkLabel="Obtenir ma clé → platform.openai.com/api-keys"
            linkHref="https://platform.openai.com/api-keys"
            placeholder="sk-proj-..."
            value={openaiKey}
            onChange={setOpenaiKey}
            show={showOpenai}
            onToggleShow={() => setShowOpenai(!showOpenai)}
            hasKey={hasOpenai}
          />

          {/* Replicate Key */}
          <KeyField
            label="Replicate (Flux Pro — rendu cuir optimal)"
            linkLabel="Obtenir ma clé → replicate.com/account/api-tokens"
            linkHref="https://replicate.com/account/api-tokens"
            placeholder="r8_..."
            value={replicateKey}
            onChange={setReplicateKey}
            show={showReplicate}
            onToggleShow={() => setShowReplicate(!showReplicate)}
            hasKey={hasReplicate}
          />

          {/* Info message */}
          <div className="bg-blanc-warm rounded-lg p-3 border border-border">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong className="text-noir">Avec Replicate :</strong> rendu cuir photoréaliste optimal via Flux Pro.
              <br />
              <strong className="text-noir">Sans Replicate :</strong> DALL-E 3 activé automatiquement.
              <br />
              <span className="text-gray-400 mt-1 block">L'application choisit toujours le meilleur moteur disponible.</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={(!openaiKey && !replicateKey) || saved}
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

            {(hasOpenai || hasReplicate) && (
              <button
                onClick={handleClear}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg border transition-colors ${
                  confirmClear
                    ? 'border-red-300 text-red-600 bg-red-50'
                    : 'border-border text-gray-500 hover:text-red-500 hover:border-red-200'
                }`}
              >
                <Trash2 size={14} />
                {confirmClear ? 'Confirmer la suppression' : 'Tout effacer'}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Vos clés sont stockées uniquement dans votre navigateur (localStorage).
            Elles ne sont jamais envoyées à nos serveurs.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function KeyField({ label, linkLabel, linkHref, placeholder, value, onChange, show, onToggleShow, hasKey }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
          hasKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-green-500' : 'bg-red-500'}`} />
          {hasKey ? 'Configurée ✓' : 'Manquante'}
        </span>
      </div>
      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-or hover:text-or-dark transition-colors"
      >
        {linkLabel}
        <ExternalLink size={11} />
      </a>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm bg-blanc font-mono focus:outline-none focus:border-or focus:ring-1 focus:ring-or"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}
