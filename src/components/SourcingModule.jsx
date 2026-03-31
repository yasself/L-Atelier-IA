import { motion } from 'framer-motion'
import { Globe, MapPin, Award, Clock, Package } from 'lucide-react'
import useAtelierStore from '../store/useAtelierStore'
import { getFournisseurs, getCategories } from '../data/sourcing'

// Map material name fragments to sourcing categories
const MATERIAU_TO_CATEGORY = {
  agneau: 'cuir',
  veau: 'cuir',
  vachette: 'cuir',
  chevreau: 'cuir',
  nubuck: 'cuir',
  cuir: 'cuir',
  microfibre: 'synthetique',
  pu: 'synthetique',
  mesh: 'synthetique',
  toile: 'synthetique',
  eva: 'semelles',
  tr: 'semelles',
  tpu: 'semelles',
  caoutchouc: 'semelles',
  cuir_semelle: 'semelles',
  pu_semelle: 'semelles',
}

function getRelevantCategories(currentSpecs) {
  const categories = getCategories()
  if (!currentSpecs) return categories

  const relevant = new Set()
  const materiau = currentSpecs.data?.materiau_principal || ''
  const semelle = currentSpecs.data?.semelle || ''

  if (materiau) {
    const key = Object.keys(MATERIAU_TO_CATEGORY).find((k) =>
      materiau.toLowerCase().includes(k)
    )
    if (key) relevant.add(MATERIAU_TO_CATEGORY[key])
  }

  if (semelle) {
    const key = Object.keys(MATERIAU_TO_CATEGORY).find((k) =>
      semelle.toLowerCase().includes(k)
    )
    if (key) relevant.add(MATERIAU_TO_CATEGORY[key])
  }

  // Always show accessoires
  relevant.add('accessoires')

  // If nothing matched, show all
  return relevant.size <= 1 ? categories : Array.from(relevant)
}

export default function SourcingModule({ segment, config }) {
  const { sourcingMode, setSourcingMode, currentSpecs } = useAtelierStore()

  const relevantCategories = getRelevantCategories(currentSpecs)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-blanc rounded-xl border border-border shadow-sm overflow-hidden"
    >
      {/* Header + Toggle pill */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-or" />
            <h3 className="text-or font-serif text-lg">Sourcing</h3>
          </div>

          {/* Toggle pill: Maroc Local / Export Premium */}
          <div className="flex bg-gray-100 rounded-full p-0.5">
            <button
              onClick={() => setSourcingMode('maroc')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                sourcingMode === 'maroc'
                  ? 'bg-or text-noir shadow-sm'
                  : 'text-gray-500 hover:text-noir'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <MapPin size={11} />
                Maroc Local
              </span>
            </button>
            <button
              onClick={() => setSourcingMode('export')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                sourcingMode === 'export'
                  ? 'bg-or text-noir shadow-sm'
                  : 'text-gray-500 hover:text-noir'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Globe size={11} />
                Export Premium
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Fournisseurs by category */}
      <div className="divide-y divide-gray-50">
        {relevantCategories.map((cat) => {
          const liste = getFournisseurs(cat, sourcingMode)
          if (liste.length === 0) return null

          return (
            <div key={cat} className="px-5 py-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 capitalize">
                {cat}
              </p>
              <div className="space-y-3">
                {liste.map((f) => (
                  <FournisseurCard key={f.id} fournisseur={f} />
                ))}
              </div>
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
    <div className="bg-blanc-warm rounded-lg p-3 text-sm border border-border">
      <div className="flex items-start justify-between gap-2">
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

      {f.certification && f.certification.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {f.certification.map((c) => (
            <CertBadge key={c} cert={c} />
          ))}
        </div>
      )}
    </div>
  )
}

function CertBadge({ cert }) {
  let cls = 'bg-gray-100 text-gray-600'
  if (cert === 'LWG Gold') cls = 'bg-or/20 text-or-dark'
  else if (cert === 'LWG Silver') cls = 'bg-gray-200 text-gray-600'
  else if (cert.includes('OEKO-TEX')) cls = 'bg-green-100 text-green-700'

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium ${cls}`}>
      <Award size={9} />
      {cert}
    </span>
  )
}

function QualiteBadge({ qualite }) {
  const colors = {
    standard: 'bg-gray-100 text-gray-600',
    premium: 'bg-or/15 text-or-dark',
    luxe: 'bg-noir text-or',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${colors[qualite] || colors.standard}`}>
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
