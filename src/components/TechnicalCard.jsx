import { motion } from 'framer-motion'
import { Shield, Layers, Ruler, Weight, AlertTriangle } from 'lucide-react'
import { getSegment } from '../data/segments'
import { montages } from '../data/specs_engine'

export default function TechnicalCard({ segment, config, enrichment }) {
  const segConfig = getSegment(segment)
  if (!segConfig || !enrichment) return null

  const { contraintes } = segConfig
  const montageInfo = montages[config.montage]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-blanc rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-noir px-5 py-4">
        <h3 className="text-or font-serif text-lg">Fiche Technique</h3>
        <p className="text-gray-400 text-xs mt-0.5">
          {config.type_chaussure || 'Type non défini'} — {segConfig.label}
        </p>
      </div>

      <div className="p-5 space-y-5">
        {/* Confiance */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Confiance données</span>
              <span className="font-medium">{enrichment.confiance}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${enrichment.confiance}%`,
                  backgroundColor: enrichment.confiance >= 80 ? '#22c55e' : enrichment.confiance >= 50 ? '#D4AF37' : '#ef4444',
                }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{enrichment.source}</span>
        </div>

        {/* Contraintes segment */}
        <Section icon={Ruler} title="Contraintes segment">
          <DataRow label="Poids max / paire" value={`${contraintes.poids_max_g} g`} />
          <DataRow label="Épaisseur tige max" value={`${contraintes.epaisseur_tige_max_mm} mm`} />
          <DataRow label="Hauteur talon max" value={`${contraintes.hauteur_talon_max_mm} mm`} />
          <DataRow label="Flexibilité min." value={contraintes.flexibilite} />
        </Section>

        {/* Construction */}
        <Section icon={Layers} title="Construction">
          <DataRow label="Matériau tige" value={config.materiau_tige || '—'} />
          <DataRow label="Montage" value={montageInfo?.label || config.montage || '—'} />
          {montageInfo && (
            <>
              <DataRow label="Coût relatif" value={`×${montageInfo.cout_relatif}`} />
              <DataRow label="Réparabilité" value={montageInfo.reparabilite} />
            </>
          )}
          <DataRow label="Semelle" value={config.semelle_type || '—'} />
          <DataRow label="Fermetures" value={contraintes.fermetures.join(', ')} />
        </Section>

        {/* Normes */}
        <Section icon={Shield} title="Normes & Tests">
          <div className="space-y-1">
            {segConfig.normes_obligatoires.map((n) => (
              <span key={n} className="inline-block text-xs bg-or/10 text-or-dark px-2 py-0.5 rounded mr-1 mb-1">
                {n}
              </span>
            ))}
          </div>
          <ul className="mt-2 space-y-1">
            {segConfig.tests_requis.map((t) => (
              <li key={t} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-or mt-0.5">•</span>
                {t}
              </li>
            ))}
          </ul>
        </Section>

        {/* Prix indicatifs */}
        <Section icon={Weight} title="Gamme prix (MAD)">
          <div className="flex gap-3">
            {Object.entries(segConfig.gamme_prix_mad).map(([niveau, prix]) => (
              <div key={niveau} className="flex-1 text-center bg-gray-50 rounded-lg p-2">
                <div className="text-xs text-gray-400 capitalize">{niveau}</div>
                <div className="text-sm font-medium text-noir">{prix} MAD</div>
              </div>
            ))}
          </div>
        </Section>

        {/* IA suggestions */}
        {enrichment.data?.suggestion_ia && (
          <Section icon={AlertTriangle} title="Suggestions IA">
            <p className="text-xs text-gray-600">{enrichment.data.suggestion_ia}</p>
          </Section>
        )}
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

function DataRow({ label, value }) {
  return (
    <div className="flex justify-between py-1 text-sm border-b border-gray-50 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-noir">{value}</span>
    </div>
  )
}
