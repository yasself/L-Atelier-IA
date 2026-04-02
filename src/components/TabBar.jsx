import { motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import useAtelierStore from '../store/useAtelierStore'

const SEGMENT_EMOJI = { bebe: '👶', enfant: '👦', femme: '👠', homme: '👞' }

export default function TabBar() {
  const { sessions, activeSessionId, addSession, removeSession, setActiveSession } = useAtelierStore()

  if (!sessions || sessions.length === 0) return null

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4 scrollbar-thin">
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId
        const emoji = SEGMENT_EMOJI[session.segment] || '📋'
        const label = session.config?.type_chaussure
          ? `${emoji} ${session.config.type_chaussure}`.slice(0, 14)
          : session.label
        const isGenerating = session.isGenerating
        const isDone = session.renderStatus === 'complete'

        return (
          <button
            key={session.id}
            onClick={() => setActiveSession(session.id)}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 border shrink-0 ${
              isActive
                ? 'bg-noir text-or border-or shadow-sm'
                : 'bg-blanc text-gray-500 border-border hover:border-or/50 hover:text-noir'
            }`}
          >
            <span>{label}</span>

            {/* Status badge */}
            {isGenerating && (
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 rounded-full bg-or"
              />
            )}
            {isDone && !isGenerating && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}

            {/* Close button */}
            {sessions.length > 1 && (
              <span
                onClick={(e) => { e.stopPropagation(); removeSession(session.id) }}
                className="ml-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <X size={12} />
              </span>
            )}
          </button>
        )
      })}

      {/* Add tab */}
      {sessions.length < 6 && (
        <button
          onClick={() => addSession()}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-dashed border-border text-gray-400 hover:border-or hover:text-or transition-colors shrink-0"
        >
          <Plus size={14} />
        </button>
      )}
    </div>
  )
}
