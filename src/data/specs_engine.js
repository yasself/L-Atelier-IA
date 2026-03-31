/**
 * Dictionnaire complet des spécifications techniques chaussures
 * Matériaux, semelles, montages et règles par segment
 */

export const materiaux = {
  cuir: {
    vachette: {
      label: 'Cuir de vachette',
      epaisseur: { min: 1.0, max: 1.6, unite: 'mm' },
      usages: ['tige', 'doublure', 'quartiers'],
      segments: ['femme', 'homme'],
      resistance_flexion: 50000,
      certification: 'LWG',
    },
    chevreau: {
      label: 'Cuir de chevreau',
      epaisseur: { min: 0.6, max: 1.0, unite: 'mm' },
      usages: ['tige', 'doublure'],
      segments: ['femme', 'homme'],
      resistance_flexion: 30000,
      certification: 'LWG',
    },
    agneau: {
      label: 'Cuir d\'agneau',
      epaisseur: { min: 0.5, max: 0.8, unite: 'mm' },
      usages: ['doublure', 'tige souple'],
      segments: ['femme', 'bebe'],
      resistance_flexion: 20000,
      certification: 'LWG',
    },
    veau: {
      label: 'Cuir de veau',
      epaisseur: { min: 0.8, max: 1.4, unite: 'mm' },
      usages: ['tige', 'doublure premium'],
      segments: ['femme', 'homme', 'enfant'],
      resistance_flexion: 40000,
      certification: 'LWG',
    },
    nubuck: {
      label: 'Nubuck',
      epaisseur: { min: 1.0, max: 1.4, unite: 'mm' },
      usages: ['tige'],
      segments: ['femme', 'homme', 'enfant'],
      resistance_flexion: 45000,
      certification: 'LWG',
    },
  },
  synthetique: {
    pu: {
      label: 'PU (Polyuréthane)',
      epaisseur: { min: 0.8, max: 1.2, unite: 'mm' },
      usages: ['tige', 'doublure'],
      segments: ['bebe', 'enfant', 'femme', 'homme'],
      resistance_flexion: 60000,
      certification: null,
    },
    microfibre: {
      label: 'Microfibre',
      epaisseur: { min: 0.6, max: 1.0, unite: 'mm' },
      usages: ['doublure', 'tige'],
      segments: ['bebe', 'enfant', 'femme'],
      resistance_flexion: 50000,
      certification: null,
    },
  },
  textile: {
    mesh: {
      label: 'Mesh respirant',
      epaisseur: { min: 0.4, max: 0.8, unite: 'mm' },
      usages: ['tige', 'doublure'],
      segments: ['bebe', 'enfant', 'femme', 'homme'],
      resistance_flexion: 80000,
      certification: null,
    },
    toile: {
      label: 'Toile coton',
      epaisseur: { min: 0.5, max: 1.0, unite: 'mm' },
      usages: ['tige'],
      segments: ['enfant', 'femme', 'homme'],
      resistance_flexion: 40000,
      certification: 'OEKO-TEX',
    },
  },
}

export const semelles = {
  types: {
    tr: {
      label: 'TR (Thermoplastique Rubber)',
      densite: { min: 0.9, max: 1.2 },
      durete_shore: { min: 50, max: 70, echelle: 'A' },
      usure_din: { max: 150, unite: 'mm³' },
      segments: ['enfant', 'femme', 'homme'],
    },
    tpu: {
      label: 'TPU (Thermoplastique Polyuréthane)',
      densite: { min: 1.1, max: 1.3 },
      durete_shore: { min: 55, max: 75, echelle: 'A' },
      usure_din: { max: 100, unite: 'mm³' },
      segments: ['femme', 'homme'],
    },
    eva: {
      label: 'EVA (Éthylène-Vinyle-Acétate)',
      densite: { min: 0.15, max: 0.35 },
      durete_shore: { min: 30, max: 55, echelle: 'C' },
      usure_din: { max: 250, unite: 'mm³' },
      segments: ['bebe', 'enfant', 'femme', 'homme'],
    },
    cuir_semelle: {
      label: 'Cuir (semelle)',
      densite: { min: 0.8, max: 1.0 },
      durete_shore: { min: 70, max: 90, echelle: 'A' },
      usure_din: { max: 300, unite: 'mm³' },
      segments: ['femme', 'homme'],
    },
    pu_semelle: {
      label: 'PU (semelle)',
      densite: { min: 0.5, max: 0.7 },
      durete_shore: { min: 55, max: 70, echelle: 'A' },
      usure_din: { max: 120, unite: 'mm³' },
      segments: ['femme', 'homme'],
    },
    caoutchouc: {
      label: 'Caoutchouc naturel',
      densite: { min: 1.0, max: 1.3 },
      durete_shore: { min: 55, max: 75, echelle: 'A' },
      usure_din: { max: 100, unite: 'mm³' },
      segments: ['enfant', 'homme'],
    },
  },
  composants: {
    premiere: ['cuir végétal', 'non-tissé', 'EVA revêtu cuir', 'carton renforcé'],
    intercalaire: ['mousse latex', 'mousse PU', 'feutre', 'liège'],
  },
}

export const montages = {
  colle: {
    label: 'Collé (Cemented)',
    description: 'Assemblage par colle polyuréthane bi-composant',
    segments: ['bebe', 'enfant', 'femme', 'homme'],
    cout_relatif: 1,
    flexibilite: 'haute',
    reparabilite: 'moyenne',
  },
  cousu_blake: {
    label: 'Cousu Blake',
    description: 'Couture traversant semelle intérieure et extérieure',
    segments: ['femme', 'homme'],
    cout_relatif: 2.5,
    flexibilite: 'très haute',
    reparabilite: 'haute',
  },
  cousu_goodyear: {
    label: 'Cousu Goodyear',
    description: 'Trépointe cousue, semelle extérieure cousue',
    segments: ['homme'],
    cout_relatif: 4,
    flexibilite: 'moyenne',
    reparabilite: 'très haute',
  },
  cousu_strobel: {
    label: 'Strobel',
    description: 'Tige cousue à une semelle souple type chaussette',
    segments: ['bebe', 'enfant'],
    cout_relatif: 1.5,
    flexibilite: 'très haute',
    reparabilite: 'faible',
  },
  injection: {
    label: 'Injecté',
    description: 'Semelle injectée directement sur la tige',
    segments: ['enfant', 'femme', 'homme'],
    cout_relatif: 1.8,
    flexibilite: 'haute',
    reparabilite: 'faible',
  },
  vulcanise: {
    label: 'Vulcanisé',
    description: 'Caoutchouc vulcanisé autour de la tige',
    segments: ['enfant', 'homme'],
    cout_relatif: 2,
    flexibilite: 'moyenne',
    reparabilite: 'faible',
  },
}

export const reglesParSegment = {
  bebe: {
    epaisseur_tige_max: 0.8,
    poids_max_paire: 120,
    hauteur_talon_max: 0,
    flexibilite_min: 'très haute',
    substances_interdites: ['chrome VI', 'nickel', 'formaldéhyde > 20ppm'],
    normes: ['EN 71-3', 'REACH Annexe XVII'],
    montages_autorises: ['colle', 'cousu_strobel'],
    semelles_autorisees: ['eva'],
  },
  enfant: {
    epaisseur_tige_max: 1.2,
    poids_max_paire: 300,
    hauteur_talon_max: 20,
    flexibilite_min: 'haute',
    substances_interdites: ['chrome VI', 'formaldéhyde > 75ppm'],
    normes: ['EN 17072', 'REACH'],
    montages_autorises: ['colle', 'cousu_strobel', 'injection', 'vulcanise'],
    semelles_autorisees: ['tr', 'eva', 'caoutchouc'],
  },
  femme: {
    epaisseur_tige_max: 1.6,
    poids_max_paire: 600,
    hauteur_talon_max: 120,
    flexibilite_min: 'moyenne',
    substances_interdites: ['chrome VI > 3mg/kg'],
    normes: ['REACH', 'ISO 20344'],
    montages_autorises: ['colle', 'cousu_blake', 'injection'],
    semelles_autorisees: ['tr', 'tpu', 'eva', 'cuir_semelle', 'pu_semelle'],
  },
  homme: {
    epaisseur_tige_max: 1.8,
    poids_max_paire: 900,
    hauteur_talon_max: 45,
    flexibilite_min: 'moyenne',
    substances_interdites: ['chrome VI > 3mg/kg'],
    normes: ['REACH', 'ISO 20344', 'ISO 20345'],
    montages_autorises: ['colle', 'cousu_blake', 'cousu_goodyear', 'injection', 'vulcanise'],
    semelles_autorisees: ['tr', 'tpu', 'eva', 'cuir_semelle', 'pu_semelle', 'caoutchouc'],
  },
}

/**
 * Retourne les matériaux valides pour un segment donné
 */
export function getMateriauxParSegment(segment) {
  const result = {}
  for (const [categorie, items] of Object.entries(materiaux)) {
    for (const [id, mat] of Object.entries(items)) {
      if (mat.segments.includes(segment)) {
        if (!result[categorie]) result[categorie] = {}
        result[categorie][id] = mat
      }
    }
  }
  return result
}

/**
 * Retourne les semelles valides pour un segment donné
 */
export function getSemellesParSegment(segment) {
  const regles = reglesParSegment[segment]
  if (!regles) return {}
  const result = {}
  for (const id of regles.semelles_autorisees) {
    if (semelles.types[id]) {
      result[id] = semelles.types[id]
    }
  }
  return result
}

/**
 * Retourne les montages valides pour un segment donné
 */
export function getMontagesParSegment(segment) {
  const regles = reglesParSegment[segment]
  if (!regles) return {}
  const result = {}
  for (const id of regles.montages_autorises) {
    if (montages[id]) {
      result[id] = montages[id]
    }
  }
  return result
}

/**
 * Valide une configuration technique contre les règles du segment
 */
export function validerConfiguration(segment, config) {
  const regles = reglesParSegment[segment]
  if (!regles) return { valide: false, erreurs: ['Segment inconnu'] }

  const erreurs = []

  if (config.epaisseur_tige > regles.epaisseur_tige_max) {
    erreurs.push(`Épaisseur tige (${config.epaisseur_tige}mm) dépasse le max ${regles.epaisseur_tige_max}mm`)
  }
  if (config.poids_paire > regles.poids_max_paire) {
    erreurs.push(`Poids paire (${config.poids_paire}g) dépasse le max ${regles.poids_max_paire}g`)
  }
  if (config.hauteur_talon > regles.hauteur_talon_max) {
    erreurs.push(`Hauteur talon (${config.hauteur_talon}mm) dépasse le max ${regles.hauteur_talon_max}mm`)
  }
  if (config.montage && !regles.montages_autorises.includes(config.montage)) {
    erreurs.push(`Montage "${config.montage}" non autorisé pour le segment ${segment}`)
  }
  if (config.semelle && !regles.semelles_autorisees.includes(config.semelle)) {
    erreurs.push(`Semelle "${config.semelle}" non autorisée pour le segment ${segment}`)
  }

  return { valide: erreurs.length === 0, erreurs }
}
