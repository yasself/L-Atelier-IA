import { motion } from 'framer-motion'
import { Trash2, Search, Download, PenLine, Camera, FileText, Settings as SettingsIcon } from 'lucide-react'
import { useState } from 'react'
import useAtelierStore from '../store/useAtelierStore'
import { configService } from '../services/configService'
import Sidebar from '../components/Sidebar'
import Generator from '../components/Generator'
import ImportModule from '../components/ImportModule'
import Settings from '../components/Settings'
import * as historyService from '../services/historyService'

const INPUT_MODES = [
  { id: 'text', label: 'Inspiration texte', icon: PenLine },
  { id: 'photo', label: 'Photo / Croquis', icon: Camera },
  { id: 'pdf', label: 'Fiche PDF', icon: FileText },
]

const SEGMENT_EMOJI = {
  bebe: '👶',
  enfant: '👦',
  femme: '👠',
  homme: '👞',
}

function getSessionEmoji(segment) {
  return SEGMENT_EMOJI[segment] || '📋'
}

function SessionTabs() {
  const { sessions, activeSessionId, addSession, removeSession, setActiveSession } = useAtelierStore()

  return (
    <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId
        return (
          <button
            key={session.id}
            onClick={() => setActiveSession(session.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 border ${
              isActive
                ? 'bg-noir text-or border-noir shadow-sm'
                : 'bg-blanc text-gray-500 border-gray-200 hover:border-gray-300 hover:text-noir'
            }`}
          >
            <span>{getSessionEmoji(session.segment)}</span>
            <span>{session.config?.type_chaussure || session.label}</span>
            {session.isGenerating && (
              <span className="animate-pulse text-or ml-0.5">●</span>
            )}
            {sessions.length > 1 && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); removeSession(session.id) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); removeSession(session.id) } }}
                className={`ml-0.5 leading-none rounded hover:text-red-500 transition-colors ${isActive ? 'text-or/70' : 'text-gray-400'}`}
                aria-label="Fermer l'onglet"
              >
                ×
              </span>
            )}
          </button>
        )
      })}
      {sessions.length < 6 && (
        <button
          onClick={addSession}
          className="px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-noir hover:bg-blanc border border-dashed border-gray-300 hover:border-gray-400 transition-all duration-200 shrink-0"
          aria-label="Nouveau projet"
        >
          +
        </button>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { activeView, inputMode, setInputMode } = useAtelierStore()

  return (
    <div className="flex min-h-screen bg-blanc-warm">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
          {activeView === 'settings' && <Settings />}
          {activeView === 'history' && <HistoryView />}
          {activeView === 'generator' && (
            <>
              {/* Session tabs */}
              <SessionTabs />

              {/* Setup guard */}
              {!configService.hasValidConfig() && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-or/10 border border-or/30 rounded-xl p-4 mb-6 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-noir">Clé API OpenAI requise</p>
                    <p className="text-xs text-gray-500 mt-0.5">Configurez votre clé pour générer des rendus et analyser vos modèles</p>
                  </div>
                  <button
                    onClick={() => useAtelierStore.getState().setActiveView('settings')}
                    className="flex items-center gap-2 px-4 py-2 bg-or text-noir text-sm font-medium rounded-lg hover:bg-or-light transition-colors shrink-0"
                  >
                    <SettingsIcon size={14} />
                    Configurer
                  </button>
                </motion.div>
              )}

              {/* Input mode selector */}
              <div className="flex items-center gap-1 bg-blanc rounded-xl border border-border p-1 mb-6 shadow-sm">
                {INPUT_MODES.map((mode) => {
                  const Icon = mode.icon
                  const isActive = inputMode === mode.id
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setInputMode(mode.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-noir text-or shadow-sm'
                          : 'text-gray-500 hover:text-noir hover:bg-blanc-warm'
                      }`}
                    >
                      <Icon size={15} />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Input content based on mode */}
              {inputMode === 'text' && <Generator />}
              {inputMode === 'photo' && <ImportModule mode="photo" />}
              {inputMode === 'pdf' && <ImportModule mode="pdf" />}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function HistoryView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [entries, setEntries] = useState(() => historyService.getAll())

  const filtered = searchQuery
    ? historyService.search(searchQuery)
    : entries

  const handleDelete = (id) => {
    historyService.remove(id)
    setEntries(historyService.getAll())
  }

  const handleExport = () => {
    const json = historyService.exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `atelier-ia-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-noir">Historique</h2>
        {entries.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-noir border border-gray-200 rounded-lg transition-colors"
          >
            <Download size={14} />
            Exporter JSON
          </button>
        )}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher dans l'historique..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-blanc focus:outline-none focus:border-or focus:ring-1 focus:ring-or"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-serif">Aucune fiche sauvegardée</p>
          <p className="text-sm mt-1">Les fiches générées apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blanc rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-medium text-noir text-sm">
                  {entry.config?.type_chaussure || 'Fiche technique'}
                  <span className="text-or ml-2 capitalize">{entry.config?.segment}</span>
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  {entry.config?.materiau_tige && <span>Tige: {entry.config.materiau_tige}</span>}
                  {entry.config?.montage && <span>Montage: {entry.config.montage}</span>}
                  <span>{new Date(entry.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-gray-300 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
