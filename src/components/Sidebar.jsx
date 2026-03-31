import { motion } from 'framer-motion'
import { Baby, Footprints, Sparkles, UserRound, Clock, PanelLeftClose, PanelLeft } from 'lucide-react'
import useAtelierStore from '../store/useAtelierStore'
import { getSegmentsList } from '../data/segments'
import * as historyService from '../services/historyService'

const iconMap = { Baby, Footprints, Sparkles, UserRound }

export default function Sidebar() {
  const { segment, setSegment, sidebarOpen, toggleSidebar, setActiveView, activeView } = useAtelierStore()
  const segmentsList = getSegmentsList()
  const recentHistory = historyService.getRecent(5)

  return (
    <>
      {/* Toggle mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-noir text-blanc p-2 rounded-lg"
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

        {/* Segments */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Segments</p>
          <ul className="space-y-1">
            {segmentsList.map((seg) => {
              const Icon = iconMap[seg.icon] || Footprints
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
                    <span className="ml-auto text-xs text-gray-500">{seg.pointures.min}-{seg.pointures.max}</span>
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
          {recentHistory.length > 0 && (
            <>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 mt-8">Récents</p>
              <ul className="space-y-1">
                {recentHistory.map((entry) => (
                  <li key={entry.id} className="text-xs text-gray-400 px-3 py-1.5 truncate">
                    {entry.config?.type_chaussure || 'Fiche'} — {entry.config?.segment || ''}
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

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}
