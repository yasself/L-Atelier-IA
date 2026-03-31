/**
 * Configuration des 4 segments : Bébé, Enfant, Femme, Homme
 * Avec contraintes de construction spécifiques
 */

const segments = {
  bebe: {
    id: 'bebe',
    label: 'Bébé',
    icon: 'Baby',
    pointures: { min: 16, max: 24 },
    age: '0-3 ans',
    contraintes: {
      poids_max_g: 120,
      hauteur_tige_max_mm: 80,
      hauteur_talon_max_mm: 0,
      epaisseur_tige_max_mm: 0.8,
      flexibilite: 'très haute',
      fermetures: ['scratch', 'élastique', 'zip latéral'],
      doublure_obligatoire: true,
      contrefort_rigide: false,
      bout_dur: false,
    },
    materiaux_recommandes: {
      tige: ['agneau', 'microfibre', 'mesh'],
      doublure: ['agneau', 'microfibre'],
      semelle: ['eva'],
    },
    montages_recommandes: ['cousu_strobel', 'colle'],
    normes_obligatoires: ['EN 71-3', 'REACH Annexe XVII'],
    tests_requis: [
      'Migration métaux lourds',
      'Résistance flexion > 15 000 cycles',
      'Formaldéhyde < 20 ppm',
      'Résistance déchirure doublure',
    ],
    gamme_prix_mad: { entree: 80, milieu: 150, premium: 280 },
  },

  enfant: {
    id: 'enfant',
    label: 'Enfant',
    icon: 'Footprints',
    pointures: { min: 25, max: 36 },
    age: '3-12 ans',
    contraintes: {
      poids_max_g: 300,
      hauteur_tige_max_mm: 120,
      hauteur_talon_max_mm: 20,
      epaisseur_tige_max_mm: 1.2,
      flexibilite: 'haute',
      fermetures: ['scratch', 'lacets', 'zip', 'élastique'],
      doublure_obligatoire: true,
      contrefort_rigide: true,
      bout_dur: true,
    },
    materiaux_recommandes: {
      tige: ['veau', 'nubuck', 'pu', 'mesh', 'toile'],
      doublure: ['microfibre', 'veau'],
      semelle: ['tr', 'eva', 'caoutchouc'],
    },
    montages_recommandes: ['colle', 'cousu_strobel', 'injection'],
    normes_obligatoires: ['EN 17072', 'REACH'],
    tests_requis: [
      'Résistance flexion > 30 000 cycles',
      'Résistance abrasion semelle',
      'Adhérence semelle (sol mouillé)',
      'Chrome VI < 3 mg/kg',
    ],
    gamme_prix_mad: { entree: 120, milieu: 250, premium: 450 },
  },

  femme: {
    id: 'femme',
    label: 'Femme',
    icon: 'Sparkles',
    pointures: { min: 35, max: 42 },
    age: 'Adulte',
    contraintes: {
      poids_max_g: 600,
      hauteur_tige_max_mm: 400,
      hauteur_talon_max_mm: 120,
      epaisseur_tige_max_mm: 1.6,
      flexibilite: 'moyenne',
      fermetures: ['zip', 'boucle', 'lacets', 'élastique', 'bride'],
      doublure_obligatoire: true,
      contrefort_rigide: true,
      bout_dur: true,
    },
    materiaux_recommandes: {
      tige: ['vachette', 'chevreau', 'agneau', 'veau', 'nubuck', 'pu', 'microfibre'],
      doublure: ['chevreau', 'agneau', 'microfibre'],
      semelle: ['tr', 'tpu', 'eva', 'cuir_semelle', 'pu_semelle'],
    },
    montages_recommandes: ['colle', 'cousu_blake', 'injection'],
    normes_obligatoires: ['REACH', 'ISO 20344'],
    tests_requis: [
      'Résistance flexion > 40 000 cycles',
      'Stabilité talon',
      'Résistance arrachement tige/semelle > 3 N/mm',
      'Glissance semelle',
    ],
    gamme_prix_mad: { entree: 200, milieu: 500, premium: 1200 },
  },

  homme: {
    id: 'homme',
    label: 'Homme',
    icon: 'UserRound',
    pointures: { min: 39, max: 47 },
    age: 'Adulte',
    contraintes: {
      poids_max_g: 900,
      hauteur_tige_max_mm: 250,
      hauteur_talon_max_mm: 45,
      epaisseur_tige_max_mm: 1.8,
      flexibilite: 'moyenne',
      fermetures: ['lacets', 'zip', 'boucle', 'élastique', 'monk strap'],
      doublure_obligatoire: true,
      contrefort_rigide: true,
      bout_dur: true,
    },
    materiaux_recommandes: {
      tige: ['vachette', 'chevreau', 'veau', 'nubuck', 'pu', 'mesh', 'toile'],
      doublure: ['veau', 'chevreau', 'microfibre'],
      semelle: ['tr', 'tpu', 'eva', 'cuir_semelle', 'pu_semelle', 'caoutchouc'],
    },
    montages_recommandes: ['colle', 'cousu_blake', 'cousu_goodyear', 'injection'],
    normes_obligatoires: ['REACH', 'ISO 20344', 'ISO 20345'],
    tests_requis: [
      'Résistance flexion > 50 000 cycles',
      'Résistance arrachement tige/semelle > 4 N/mm',
      'Résistance abrasion semelle DIN',
      'Imperméabilité (si applicable)',
    ],
    gamme_prix_mad: { entree: 250, milieu: 600, premium: 1500 },
  },
}

export default segments

/**
 * Retourne la config d'un segment par son id
 */
export function getSegment(id) {
  return segments[id] || null
}

/**
 * Retourne la liste des segments disponibles
 */
export function getSegmentsList() {
  return Object.values(segments)
}

/**
 * Vérifie si un matériau est recommandé pour un segment et un usage donné
 */
export function isMateriauRecommande(segmentId, usage, materiauId) {
  const seg = segments[segmentId]
  if (!seg) return false
  const recommandes = seg.materiaux_recommandes[usage]
  return recommandes ? recommandes.includes(materiauId) : false
}
