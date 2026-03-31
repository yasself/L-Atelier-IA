import { motion } from 'framer-motion'
import { Globe, MapPin, Award, Clock, Package, Truck } from 'lucide-react'
import useAtelierStore from '../store/useAtelierStore'
import { getFournisseurs } from '../data/sourcing'
import { getRelevantCategories } from '../services/sourcingService'

const CERT_PRIORITY = { 'LWG Gold': 0, 'LWG Silver': 1 }

function sortByCertification(list) {
  return [...list].sort((a, b) => {
    const aPrio = Math.min(...(a.certification || []).map((c) => CERT_PRIORITY[c] ?? 99))
    const bPrio = Math.min(...(b.certification || []).map((c) => CERT_PRIORITY[c] ?? 99))
    return aPrio - bPrio
  })
}

export default function SourcingModule({ segment, config }) {
  const { sourcingMode, setSourcingMode, currentSpecs } = useAtelierStore()

  const relevantCategories = getRelevantCategories(currentSpecs)

  // Collect all fournisseurs for summary
  let totalFournisseurs = 0
  let prixMin = Infinity
  let prixMax = 0
  for (const cat of relevantCategories) {
    const liste = getFournisseurs(cat, sourcingMode)
    totalFournisseurs += liste.length
    for (const f of liste) {
      const prix = f.prix_mad_m2 || f.prix_mad_paire || f.prix_mad_unite
      if (prix) {
        if (prix.min < prixMin) prixMin = prix.min
        if (prix.max > prixMax) prixMax = prix.max
      }
    }
  }
  if (prixMin === Infinity) prixMin = 0

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

          {/* Toggle pill with 200ms transition */}
          <div className="flex bg-gray-100 rounded-full p-0.5">
            <button
              onClick={() => setSourcingMode('maroc')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
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
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
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
          const liste = sortByCertification(getFournisseurs(cat, sourcingMode))
          if (liste.length === 0) return null

          return (
            <div key={cat} className="px-5 py-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 capitalize">
                {cat}
              </p>
              <div className="space-y-3">
                {liste.map((f) => (
                  <FournisseurCard key={f.id} fournisseur={f} sourcingMode={sourcingMode} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary footer */}
      {totalFournisseurs > 0 && (
        <div className="px-5 py-3 border-t border-border bg-blanc-warm">
          <p className="text-xs text-gray-500">
            <span className="font-medium text-noir">{totalFournisseurs}</span> fournisseur{totalFournisseurs > 1 ? 's' : ''} disponibles
            {prixMax > 0 && (
              <span> — Budget matière estimé : <span className="font-medium text-noir">{prixMin}–{prixMax} MAD</span></span>
            )}
          </p>
        </div>
      )}
    </motion.div>
  )
}

function FournisseurCard({ fournisseur: f, sourcingMode }) {
  const prix = f.prix_mad_m2 || f.prix_mad_paire || f.prix_mad_unite
  const unite = f.prix_mad_m2 ? '/m²' : f.prix_mad_paire ? '/paire' : '/unité'

  // Delivery estimate: local = direct, international = +7 days transit
  const isLocal = f.pays === 'Maroc'
  const deliveryDays = isLocal ? f.delai_jours : f.delai_jours + 7
  const deliveryLabel = isLocal
    ? `${f.delai_jours}j délai`
    : `${deliveryDays}j (${f.delai_jours}j + 7j transit)`

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
        <DataPill icon={Clock} label={deliveryLabel} />
        {prix && <DataPill icon={Package} label={`${prix.min}–${prix.max} MAD${unite}`} />}
        <DataPill icon={Package} label={`MOQ: ${f.moq} ${f.moq_unite}`} />
      </div>

      {/* Delivery to Maroc estimate */}
      {!isLocal && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
          <Truck size={11} />
          <span>Délai estimé livraison Maroc : {deliveryDays} jours</span>
        </div>
      )}

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
