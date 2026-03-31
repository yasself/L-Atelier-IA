import { motion } from 'framer-motion'
import { Trash2, Search, Download } from 'lucide-react'
import { useState } from 'react'
import useAtelierStore from '../store/useAtelierStore'
import Sidebar from '../components/Sidebar'
import Generator from '../components/Generator'
import * as historyService from '../services/historyService'

export default function Dashboard() {
  const { activeView } = useAtelierStore()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
          {activeView === 'generator' && <Generator />}
          {activeView === 'history' && <HistoryView />}
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

      {/* Recherche */}
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

      {/* Liste */}
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
