/**
 * Configuration des 4 segments : Bébé, Enfant, Femme, Homme
 * Avec contraintes de construction spécifiques
 */

const segments = {
  bebe: {
    id: 'bebe',
    label: 'Bébé',
    icon: 'Baby',
    pointures: { min: 16, max: 22 },
    age: '0-24 mois',
    sous_segments: {
      premiers_pas: { label: 'Premiers pas', age: '9-15 mois', pointures: { min: 16, max: 19 } },
      marcheur: { label: 'Marcheur', age: '15-24 mois', pointures: { min: 19, max: 22 } },
    },
    largeurs: ['standard'],
    contraintes: {
      poids_max_g: 80,
      hauteur_tige_max_mm: 80,
      hauteur_talon_max_mm: 0,
      epaisseur_tige_max_mm: 0.8,
      epaisseur_semelle_max_mm: 5,
      flexibilite: 'très haute',
      fermetures: ['scratch', 'élastique', 'velcro', 'bouton-pression'],
      fermetures_interdites: ['zip', 'lacets'],
      doublure_obligatoire: true,
      doublure_oeko_tex_obligatoire: true,
      contrefort_rigide: false,
      bout_dur: false,
      tannage_chrome_interdit: true,
      semelle_antiderapante_obligatoire: true,
    },
    materiaux_recommandes: {
      tige: ['agneau', 'nappa_vegetal', 'chevreau_vegetal', 'microfibre', 'mesh', 'coton_bio', 'textile_technique', 'pu', 'knit'],
      doublure: ['agneau', 'microfibre', 'textile_coton_bio'],
      semelle: ['eva', 'gomme_recyclee', 'orthopedique'],
    },
    montages_recommandes: ['cousu_strobel', 'colle', 'cousu_retourne', 'opanka', 'soude_souple'],
    normes_obligatoires: ['EN 71-3', 'REACH Annexe XVII', 'OEKO-TEX Standard 100'],
    tests_requis: [
      'Migration métaux lourds',
      'Résistance flexion > 15 000 cycles',
      'Formaldéhyde < 20 ppm',
      'Résistance déchirure doublure',
      'Test antidérapance EN ISO 13287',
    ],
    gamme_prix_mad: { entree: 80, milieu: 150, premium: 280 },
  },

  enfant: {
    id: 'enfant',
    label: 'Enfant',
    icon: 'Footprints',
    pointures: { min: 23, max: 36 },
    age: '2-12 ans',
    sous_segments: {
      petite_enfance: { label: 'Petite enfance', age: '2-5 ans', pointures: { min: 23, max: 28 } },
      scolaire: { label: 'Scolaire', age: '6-9 ans', pointures: { min: 28, max: 33 } },
      preado: { label: 'Préado', age: '10-12 ans', pointures: { min: 33, max: 36 } },
    },
    largeurs: ['standard', 'large'],
    contraintes: {
      poids_max_g: 300,
      hauteur_tige_max_mm: 120,
      hauteur_talon_max_mm: 20,
      epaisseur_tige_max_mm: 1.2,
      flexibilite: 'haute',
      fermetures: ['scratch', 'lacets', 'zip', 'élastique', 'velcro'],
      fermetures_interdites_petit_enfant: ['zip intérieur'],
      doublure_obligatoire: true,
      contrefort_rigide: true,
      bout_dur: true,
      resistance_abrasion_prioritaire: true,
      systeme_anti_odeur_recommande: true,
      montage_goodyear_interdit: true,
    },
    materiaux_recommandes: {
      tige: ['veau', 'nubuck', 'pu', 'mesh', 'toile', 'canvas', 'knit', 'cuir_waterproof', 'microfibre', 'denim'],
      doublure: ['microfibre', 'veau', 'textile_coton_bio', 'laine_merinos'],
      semelle: ['tr', 'eva', 'caoutchouc', 'orthopedique'],
    },
    montages_recommandes: ['colle', 'cousu_strobel', 'injection', 'strobel', 'vulcanise'],
    normes_obligatoires: ['EN 17072', 'REACH'],
    tests_requis: [
      'Résistance flexion > 30 000 cycles',
      'Résistance abrasion semelle (priorité)',
      'Adhérence semelle (sol mouillé)',
      'Chrome VI < 3 mg/kg',
      'Test solidité coloris au frottement',
    ],
    gamme_prix_mad: { entree: 120, milieu: 250, premium: 450 },
  },

  femme: {
    id: 'femme',
    label: 'Femme',
    icon: 'Sparkles',
    pointures: { min: 34, max: 43 },
    age: 'Adulte',
    sous_segments: {
      confort: { label: 'Confort', description: 'Cambrure standard, plat ou bas' },
      mode: { label: 'Mode', description: 'Talon variable, tendance' },
      sport: { label: 'Sport', description: 'Running, training, outdoor' },
      grossesse: { label: 'Grossesse', description: 'Pied gonflé, semelle amortissante' },
    },
    largeurs: ['étroit', 'standard', 'large'],
    talons: {
      plat: { min: 0, max: 20, label: 'Plat' },
      bas: { min: 20, max: 40, label: 'Bas' },
      mi_haut: { min: 40, max: 70, label: 'Mi-haut' },
      haut: { min: 70, max: 100, label: 'Haut' },
      aiguille: { min: 100, max: 120, label: 'Aiguille' },
    },
    bouts: ['rond', 'carré', 'pointu', 'amande', 'ouvert'],
    contraintes: {
      poids_max_g: 600,
      hauteur_tige_max_mm: 400,
      hauteur_talon_max_mm: 120,
      epaisseur_tige_max_mm: 1.6,
      flexibilite: 'moyenne',
      fermetures: ['zip', 'boucle', 'lacets', 'élastique', 'bride', 'zip intérieur'],
      doublure_obligatoire: true,
      contrefort_rigide: true,
      bout_dur: true,
      cambrion_obligatoire_talon_40mm: true,
      cambrion_types: ['acier', 'fibre carbone'],
    },
    materiaux_recommandes: {
      tige: ['vachette', 'chevreau', 'agneau', 'veau', 'nubuck', 'pu', 'microfibre', 'box_calf', 'vachetta', 'chevre', 'cuir_perfore', 'cuir_bicolore', 'cuir_cire', 'cuir_waterproof', 'neoprene', 'knit', 'mesh', 'toile', 'canvas', 'denim', 'toile_enduite'],
      doublure: ['chevreau', 'agneau', 'microfibre', 'chevre_naturelle', 'lin_naturel', 'laine_merinos', 'fourrure_synthetique', 'sans_doublure'],
      semelle: ['tr', 'tpu', 'eva', 'cuir_semelle', 'pu_semelle', 'plateforme_liege', 'pu_bi_densite', 'caoutchouc', 'vibram', 'texon', 'orthopedique'],
    },
    montages_recommandes: ['colle', 'cousu_blake', 'cousu_goodyear', 'injection', 'ago', 'strobel', 'vulcanise'],
    normes_obligatoires: ['REACH', 'ISO 20344'],
    tests_requis: [
      'Résistance flexion > 40 000 cycles',
      'Stabilité talon (EN ISO 19956)',
      'Résistance arrachement tige/semelle > 3 N/mm',
      'Glissance semelle (EN ISO 13287)',
      'Test fatigue cambrion (talon > 40mm)',
    ],
    gamme_prix_mad: { entree: 200, milieu: 500, premium: 1200 },
  },

  homme: {
    id: 'homme',
    label: 'Homme',
    icon: 'UserRound',
    pointures: { min: 39, max: 48 },
    age: 'Adulte',
    sous_segments: {
      ville_classique: { label: 'Ville classique', description: 'Derby, Richelieu, Monk' },
      casual: { label: 'Casual', description: 'Sneakers, loafers, desert boots' },
      sport: { label: 'Sport', description: 'Running, training' },
      outdoor: { label: 'Outdoor', description: 'Randonnée, trail' },
      securite: { label: 'Sécurité/Travail', description: 'Bout acier, semelle anti-perforation' },
    },
    largeurs: ['standard', 'large', 'extra-large'],
    modeles_classiques: {
      derby: { label: 'Derby', empeigne: 'ouverte', fermeture: 'lacets', montage_recommande: 'cousu_blake', oeillets: '4-5' },
      richelieu: { label: 'Richelieu (Oxford)', empeigne: 'fermée', fermeture: 'lacets', montage_recommande: 'cousu_goodyear', oeillets: '5' },
      monk_strap: { label: 'Monk strap', empeigne: 'fermée', fermeture: 'boucle', montage_recommande: 'cousu_blake', boucles: '1-2' },
      chelsea: { label: 'Chelsea boot', empeigne: 'fermée', fermeture: 'élastique latéral', montage_recommande: 'cousu_blake', tige: 'courte' },
      brogue: { label: 'Brogue', empeigne: 'ouverte ou fermée', fermeture: 'lacets', montage_recommande: 'cousu_goodyear', ornement: 'perforations, medallion' },
      loafer: { label: 'Loafer/Mocassin', empeigne: 'fermée', fermeture: 'sans', montage_recommande: 'ago', ornement: 'tassel ou kiltie optionnel' },
      desert_boot: { label: 'Desert boot', empeigne: 'ouverte', fermeture: 'lacets', montage_recommande: 'cousu_blake', tige: 'daim', semelle: 'crêpe', oeillets: '2-3' },
      chukka: { label: 'Chukka', empeigne: 'ouverte', fermeture: 'lacets', montage_recommande: 'cousu_blake', tige: 'cuir', oeillets: '2' },
    },
    contraintes: {
      poids_max_g: 900,
      hauteur_tige_max_mm: 250,
      hauteur_talon_max_mm: 45,
      epaisseur_tige_max_mm: 1.8,
      flexibilite: 'moyenne',
      fermetures: ['lacets', 'zip', 'boucle', 'élastique', 'monk strap', 'zip intérieur'],
      doublure_obligatoire: true,
      contrefort_rigide: true,
      bout_dur: true,
    },
    materiaux_recommandes: {
      tige: ['vachette', 'chevreau', 'veau', 'nubuck', 'pu', 'mesh', 'toile', 'box_calf', 'vachetta', 'cordovan', 'cuir_gras', 'chevre', 'cuir_perfore', 'cuir_bicolore', 'cuir_waterproof', 'canvas', 'denim', 'knit', 'toile_enduite', 'neoprene'],
      doublure: ['veau', 'chevreau', 'microfibre', 'chevre_naturelle', 'veau_velours', 'laine_merinos', 'lin_naturel', 'sans_doublure'],
      semelle: ['tr', 'tpu', 'eva', 'cuir_semelle', 'pu_semelle', 'caoutchouc', 'vibram', 'pu_bi_densite', 'texon', 'orthopedique'],
    },
    montages_recommandes: ['colle', 'cousu_blake', 'cousu_goodyear', 'injection', 'ago', 'norwegian_welt', 'strobel', 'vulcanise'],
    normes_obligatoires: ['REACH', 'ISO 20344', 'ISO 20345'],
    tests_requis: [
      'Résistance flexion > 50 000 cycles',
      'Résistance arrachement tige/semelle > 4 N/mm',
      'Résistance abrasion semelle DIN',
      'Imperméabilité (si applicable)',
      'Test solidité couture trépointe (Goodyear)',
    ],
    gamme_prix_mad: { entree: 250, milieu: 600, premium: 1500 },
  },
}

export const TYPES_CHAUSSURES = {
  bebe: ['Chausson', 'Bottillon', 'Sandale', 'Basket souple', 'Babouche'],
  enfant: ['Basket', 'Sandale', 'Bottine', 'Derby', 'Ballerine', 'Botte', 'Sneaker', 'Mary Jane', 'Running'],
  femme: ['Escarpin', 'Bottine', 'Sandale', 'Sneaker', 'Derby', 'Mocassin', 'Ballerine', 'Botte', 'Mule', 'Botte haute', 'Cuissarde', 'Sandale compensée', 'Plateforme', 'Mary Jane', 'Slingback', 'Peep toe', 'Gladiateur', 'Espadrille', 'Sabot', 'Tong', 'Loafer', 'Chelsea'],
  homme: ['Derby', 'Richelieu', 'Mocassin', 'Sneaker', 'Bottine', 'Chelsea', 'Monk', 'Botte', 'Brogue', 'Chukka', 'Desert boot', 'Loafer', 'Running', 'Trail', 'Randonnée', 'Boot cowboy', 'Botte équitation', 'Espadrille', 'Pantoufle'],
}

export const COULEURS = [
  'Noir', 'Marron', 'Cognac', 'Tan', 'Bordeaux', 'Marine', 'Blanc', 'Beige',
  'Gris', 'Camel', 'Kaki', 'Taupe', 'Rouge', 'Rose poudré', 'Nude', 'Or',
  'Argent', 'Bronze', 'Vert kaki', 'Bleu royal', 'Violet', 'Terracotta',
  'Corail', 'Multicolore', 'Bicolore',
]

export const STYLES = [
  'Classique', 'Sportif', 'Casual', 'Élégant', 'Bohème', 'Minimaliste', 'Urbain',
  'Soirée', 'Casual chic', 'Rock', 'Preppy', 'Vintage', 'Artisanal',
  'Luxe discret', 'Streetwear', 'Formel', 'Décontracté', 'Romantique',
]

export const FINITIONS = {
  bebe: ['Naturel', 'Mat'],
  enfant: ['Naturel', 'Mat', 'Cire', 'Hydrofuge', 'Satiné'],
  femme: ['Cire', 'Vernis', 'Naturel', 'Hydrofuge', 'Patiné', 'Antiqué', 'Brillant', 'Mat', 'Satiné', 'Deux tons', 'Délavé', 'Embossé', 'Perforé', 'Tressé', 'Métallisé', 'Irisé'],
  homme: ['Cire', 'Naturel', 'Hydrofuge', 'Patiné', 'Antiqué', 'Mat', 'Satiné', 'Deux tons', 'Délavé', 'Embossé', 'Perforé', 'Tressé'],
}

export const HAUTEURS_TALON = [
  { id: 'plat', label: 'Plat (0–10mm)', min: 0, max: 10 },
  { id: 'bas', label: 'Bas (10–30mm)', min: 10, max: 30 },
  { id: 'mi_haut', label: 'Mi-haut (30–60mm)', min: 30, max: 60 },
  { id: 'haut', label: 'Haut (60–90mm)', min: 60, max: 90 },
  { id: 'tres_haut', label: 'Très haut (90–120mm)', min: 90, max: 120 },
  { id: 'aiguille', label: 'Aiguille (>120mm)', min: 120, max: 150 },
]

export const FERMETURES = {
  bebe: ['Velcro', 'Scratch', 'Élastique', 'Bouton-pression'],
  enfant: ['Velcro', 'Scratch', 'Lacets', 'Zip', 'Élastique', 'Bouton-pression'],
  femme: ['Lacets', 'Zip', 'Zip intérieur', 'Boucle', 'Bride', 'Élastique', 'Monk strap', 'Sans fermeture'],
  homme: ['Lacets', 'Zip', 'Zip intérieur', 'Boucle', 'Élastique', 'Monk strap', 'Sans fermeture'],
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
