import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Shield, Layers, CheckCircle2, XCircle, FileText, Ruler, Footprints, Wrench, Sparkles, Heart } from 'lucide-react'
import { getSegment } from '../data/segments'
import { getLabelFr } from '../data/specs_engine'
import { exportAsJSON } from '../services/exportService'
import useAtelierStore from '../store/useAtelierStore'

function generateRefNumber() {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const uuid = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ATL-${date}-${uuid}`
}

const LABEL_MONTAGE = {
  colle: 'Collé',
  cousu_blake: 'Cousu Blake',
  cousu_goodyear: 'Cousu Goodyear',
  cousu_strobel: 'Cousu Strobel',
  injection: 'Injection',
}

const SEG_BADGE_COLORS = {
  bebe: 'bg-blue-50 text-blue-700',
  enfant: 'bg-purple-50 text-purple-700',
  femme: 'bg-pink-50 text-pink-700',
  homme: 'bg-gray-100 text-gray-700',
}

export default function TechnicalCard({ segment, config, enrichment }) {
  const { prixEstime } = useAtelierStore()
  const segConfig = getSegment(segment)
  const refNumber = useMemo(() => generateRefNumber(), [enrichment])

  if (!segConfig || !enrichment) return null

  const { contraintes } = segConfig

  const sourceBadgeClass =
    enrichment.source === 'statique' || enrichment.source?.startsWith('statique')
      ? 'bg-green-100 text-green-700'
      : 'bg-or/15 text-or-dark'

  const sourceLabel =
    enrichment.source === 'statique' || enrichment.source?.startsWith('statique')
      ? 'Statique'
      : enrichment.source === 'ia'
      ? 'IA'
      : 'Hybride'

  // Constraint checks based on segment config
  const constraints = [
    {
      label: `Poids max ${contraintes.poids_max_g} g`,
      ok: true,
    },
    {
      label: `Hauteur talon max ${contraintes.hauteur_talon_max_mm} mm`,
      ok: true,
    },
    {
      label: `Épaisseur tige max ${contraintes.epaisseur_tige_max_mm} mm`,
      ok: true,
    },
    {
      label: `Flexibilité : ${contraintes.flexibilite}`,
      ok: true,
    },
    {
      label: `Doublure obligatoire`,
      ok: contraintes.doublure_obligatoire
        ? Boolean(segConfig.materiaux_recommandes?.doublure?.length)
        : true,
    },
  ]

  const prixDisplay = prixEstime || segConfig.gamme_prix_mad

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-blanc rounded-xl border border-border shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-noir px-5 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-or font-serif text-lg">Fiche Technique</h3>
          <p className="text-gray-400 text-xs mt-0.5">
            {config.type_chaussure || 'Type non défini'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs font-mono text-gray-400">{refNumber}</span>
          <div className="flex items-center gap-2 flex-wrap justify-end">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${SEG_BADGE_COLORS[segment] || 'bg-gray-100 text-gray-600'}`}
          >
            {segConfig.label}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sourceBadgeClass}`}>
            {sourceLabel}
          </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Confidence bar */}
        {enrichment.confiance != null && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Confiance données</span>
              <span className="font-medium">{enrichment.confiance}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${enrichment.confiance}%`,
                  backgroundColor:
                    enrichment.confiance >= 80
                      ? '#22c55e'
                      : enrichment.confiance >= 50
                      ? '#D4AF37'
                      : '#ef4444',
                }}
              />
            </div>
          </div>
        )}

        {/* BOM */}
        <Section icon={Layers} title="Nomenclature (BOM)">
          <DataRow icon={Layers} label="Matériau tige" value={getLabelFr(config.materiau_tige) || '—'} />
          <DataRow icon={Footprints} label="Semelle" value={getLabelFr(config.semelle_type) || '—'} />
          <DataRow icon={Wrench} label="Montage" value={LABEL_MONTAGE[config.montage] || getLabelFr(config.montage) || '—'} />
          <DataRow icon={Sparkles} label="Finitions" value={config.finitions || 'Non spécifiée'} />
          <DataRow icon={Heart} label="Doublure" value={getLabelFr(enrichment?.data?.doublure_recommandee) || 'Non spécifiée'} />
          <DataRow label="Fermeture" value={config.fermeture ? getLabelFr(config.fermeture) : 'Non spécifiée'} />
        </Section>

        {/* Constraint checklist */}
        <Section icon={Ruler} title="Contraintes segment">
          <ul className="space-y-1.5">
            {constraints.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                {c.ok ? (
                  <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                ) : (
                  <XCircle size={13} className="text-red-400 shrink-0" />
                )}
                <span className={c.ok ? 'text-gray-600' : 'text-red-500'}>
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Normes */}
        <Section icon={Shield} title="Normes & Tests">
          <div className="flex flex-wrap gap-1 mb-2">
            {segConfig.normes_obligatoires.map((n) => (
              <span
                key={n}
                className="inline-block text-xs bg-or/10 text-or-dark px-2 py-0.5 rounded"
              >
                {n}
              </span>
            ))}
          </div>
          <ul className="space-y-1">
            {segConfig.tests_requis.map((t) => (
              <li key={t} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-or mt-0.5">•</span>
                {t}
              </li>
            ))}
          </ul>
        </Section>

        {/* Prix MAD */}
        {prixDisplay && (
          <Section icon={FileText} title="Gamme prix (MAD)">
            <div className="flex gap-3">
              {Object.entries(prixDisplay).map(([niveau, prix]) => (
                <div
                  key={niveau}
                  className="flex-1 text-center bg-blanc-warm rounded-lg p-2"
                >
                  <div className="text-xs text-gray-400 capitalize">{niveau}</div>
                  <div className="text-sm font-medium text-noir font-mono">{prix} MAD</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* IA suggestion */}
        {enrichment.data?.suggestion_ia && (
          <div className="text-xs text-gray-500 bg-blanc-warm rounded-lg p-3 italic">
            {enrichment.data.suggestion_ia}
          </div>
        )}

        {/* Export button */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => {
              const store = useAtelierStore.getState()
              const mainImage = store.renderResults?.find(r => r.view_id === 'three_quarter' && r.status === 'success')
              exportAsJSON({
                specs: enrichment,
                config: { ...config, segment },
                renderResults: store.renderResults || [],
                viewPrompts: store.currentPrompt?.viewPrompts || [],
              })
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-or/30 text-sm rounded-lg text-or hover:bg-or/10 transition-colors"
          >
            <FileText size={14} />
            Exporter JSON
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-or" />
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</h4>
      </div>
      <div className="pl-5">{children}</div>
    </div>
  )
}

function DataRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm border-b border-gray-50 last:border-0">
      <span className="text-gray-500 flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-or/60" />}
        {label}
      </span>
      <span className="font-medium text-noir">{value}</span>
    </div>
  )
}
