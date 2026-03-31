import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, MapPin, Award, Clock, Package, ChevronDown, ChevronUp } from 'lucide-react'
import useAtelierStore from '../store/useAtelierStore'
import { getFournisseurs, getCategories } from '../data/sourcing'

export default function SourcingModule({ segment, config }) {
  const { sourcingMode, setSourcingMode } = useAtelierStore()
  const [expandedCategory, setExpandedCategory] = useState(null)

  const categories = getCategories()

  const toggleCategory = (cat) => {
    setExpandedCategory(expandedCategory === cat ? null : cat)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-blanc rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header + Toggle */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-or" />
            <h3 className="text-or font-serif text-lg">Sourcing</h3>
          </div>

          {/* Toggle Maroc / Export */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setSourcingMode('maroc')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                sourcingMode === 'maroc'
                  ? 'bg-or text-noir shadow-sm'
                  : 'text-gray-500 hover:text-noir'
              }`}
            >
              <span className="flex items-center gap-1">
                <MapPin size={12} /> Maroc
              </span>
            </button>
            <button
              onClick={() => setSourcingMode('export')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                sourcingMode === 'export'
                  ? 'bg-or text-noir shadow-sm'
                  : 'text-gray-500 hover:text-noir'
              }`}
            >
              <span className="flex items-center gap-1">
                <Globe size={12} /> Export Premium
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="divide-y divide-gray-50">
        {categories.map((cat) => {
          const fournisseursList = getFournisseurs(cat, sourcingMode)
          if (fournisseursList.length === 0) return null

          const isExpanded = expandedCategory === cat

          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-noir capitalize">{cat}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{fournisseursList.length} fournisseur{fournisseursList.length > 1 ? 's' : ''}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 pb-4 space-y-3"
                >
                  {fournisseursList.map((f) => (
                    <FournisseurCard key={f.id} fournisseur={f} />
                  ))}
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function FournisseurCard({ fournisseur: f }) {
  const prix = f.prix_mad_m2 || f.prix_mad_paire || f.prix_mad_unite
  const unite = f.prix_mad_m2 ? '/m²' : f.prix_mad_paire ? '/paire' : '/unité'

  return (
    <div className="bg-gray-50 rounded-lg p-3 text-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-noir">{f.nom}</p>
          <p className="text-xs text-gray-400 mt-0.5">{f.specialite}</p>
        </div>
        <QualiteBadge qualite={f.qualite} />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <DataPill icon={MapPin} label={`${f.ville}, ${f.pays}`} />
        <DataPill icon={Clock} label={`${f.delai_jours}j délai`} />
        {prix && <DataPill icon={Package} label={`${prix.min}–${prix.max} MAD${unite}`} />}
        <DataPill icon={Package} label={`MOQ: ${f.moq} ${f.moq_unite}`} />
      </div>

      {f.certification.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {f.certification.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
              <Award size={10} /> {c}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function QualiteBadge({ qualite }) {
  const colors = {
    standard: 'bg-gray-100 text-gray-600',
    premium: 'bg-or/15 text-or-dark',
    luxe: 'bg-noir text-or',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${colors[qualite] || colors.standard}`}>
      {qualite}
    </span>
  )
}

function DataPill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <Icon size={11} className="text-gray-400 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  )
}
