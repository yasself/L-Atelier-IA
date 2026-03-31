import { motion } from 'framer-motion'
import { Baby, Footprints, Sparkles, UserRound, Clock, PanelLeftClose, PanelLeft, Trash2, Settings } from 'lucide-react'
import useAtelierStore from '../store/useAtelierStore'
import { getSegmentsList } from '../data/segments'
import useHistory from '../hooks/useHistory'

const ICON_MAP = { Baby, Footprints, Sparkles, UserRound }

function relativeTime(isoString) {
  if (!isoString) return ''
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "à l'instant"
  if (diffMin < 60) return `il y a ${diffMin}min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  return `il y a ${diffD}j`
}

function entryLabel(entry) {
  const inspiration = entry.config?.inspiration
  const type = entry.config?.type_chaussure
  const raw = inspiration || type || 'Fiche'
  return raw.length > 40 ? raw.slice(0, 40) + '…' : raw
}

export default function Sidebar() {
  const {
    segment,
    setSegment,
    sidebarOpen,
    toggleSidebar,
    setActiveView,
    activeView,
  } = useAtelierStore()

  const { history, remove, clearAll, loadEntry } = useHistory()
  const segmentsList = getSegmentsList()

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-noir text-blanc p-2 rounded-lg"
        aria-label={sidebarOpen ? 'Fermer la barre latérale' : 'Ouvrir la barre latérale'}
      >
        {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
      </button>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed lg:static top-0 left-0 z-40 w-[280px] h-screen bg-noir text-blanc flex flex-col shrink-0"
      >
        {/* Logo */}
        <div className="p-6 border-b border-noir-lighter">
          <h1 className="text-xl font-serif text-or tracking-wide">L'Atelier IA</h1>
          <p className="text-xs text-gray-400 mt-1">Générateur de Fiches Techniques</p>
        </div>

        {/* Scrollable nav */}
        <nav className="p-4 flex-1 overflow-y-auto">
          {/* Segments */}
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Segments</p>
          <ul className="space-y-1">
            {segmentsList.map((seg) => {
              const Icon = ICON_MAP[seg.icon] || Footprints
              const isActive = segment === seg.id
              return (
                <li key={seg.id}>
                  <button
                    onClick={() => { setSegment(seg.id); setActiveView('generator') }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-or/15 text-or border border-or/30'
                        : 'text-gray-300 hover:bg-noir-lighter hover:text-blanc'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{seg.label}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {seg.pointures.min}-{seg.pointures.max}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Navigation */}
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 mt-8">Navigation</p>
          <ul className="space-y-1">
            {[
              { id: 'generator', label: 'Générateur', icon: Sparkles },
              { id: 'history', label: 'Historique', icon: Clock },
              { id: 'settings', label: 'Paramètres', icon: Settings },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeView === item.id
                      ? 'bg-noir-lighter text-blanc'
                      : 'text-gray-400 hover:bg-noir-lighter hover:text-blanc'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Historique récent */}
          {history.length > 0 && (
            <>
              <div className="flex items-center justify-between mt-8 mb-3">
                <p className="text-xs uppercase tracking-widest text-gray-500">Récents</p>
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  title="Vider tout l'historique"
                >
                  Vider tout
                </button>
              </div>

              {/* Scrollable list if more than 5 entries */}
              <ul
                className={`space-y-1 ${history.length > 5 ? 'max-h-52 overflow-y-auto pr-1' : ''}`}
              >
                {history.map((entry) => (
                  <li
                    key={entry.id}
                    className="group flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-noir-lighter transition-colors cursor-pointer"
                    onClick={() => loadEntry(entry)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 truncate">
                        <span className="text-or/70 font-medium">
                          {entry.config?.segment || ''}
                        </span>
                        {entry.config?.segment ? ' · ' : ''}
                        {entryLabel(entry)}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {relativeTime(entry.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(entry.id) }}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400 mt-0.5"
                      title="Supprimer"
                      aria-label="Supprimer cette entrée"
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-noir-lighter">
          <p className="text-xs text-gray-500 text-center">v1.0 — Phase 1</p>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}
