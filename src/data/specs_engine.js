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
    box_calf: {
      label: 'Box-calf naturel',
      epaisseur: { min: 0.9, max: 1.4, unite: 'mm' },
      usages: ['tige'],
      segments: ['femme', 'homme'],
      resistance_flexion: 45000,
      certification: 'LWG',
    },
    vachetta: {
      label: 'Vachetta',
      epaisseur: { min: 1.2, max: 2.0, unite: 'mm' },
      usages: ['tige', 'ceinture', 'accessoires'],
      segments: ['femme', 'homme'],
      resistance_flexion: 55000,
      certification: 'LWG',
    },
    cuir_gras: {
      label: 'Cuir gras (Wax)',
      epaisseur: { min: 1.4, max: 2.0, unite: 'mm' },
      usages: ['tige'],
      segments: ['homme'],
      resistance_flexion: 50000,
      certification: 'LWG',
    },
    cordovan: {
      label: 'Cordovan (cheval)',
      epaisseur: { min: 0.8, max: 1.2, unite: 'mm' },
      usages: ['tige'],
      segments: ['homme'],
      resistance_flexion: 60000,
      certification: 'LWG',
    },
    chevre: {
      label: 'Cuir de chèvre',
      epaisseur: { min: 0.6, max: 1.0, unite: 'mm' },
      usages: ['tige', 'doublure'],
      segments: ['femme', 'homme'],
      resistance_flexion: 35000,
      certification: 'LWG',
    },
    cuir_perfore: {
      label: 'Cuir perforé (brogue)',
      epaisseur: { min: 1.0, max: 1.6, unite: 'mm' },
      usages: ['tige'],
      segments: ['femme', 'homme'],
      resistance_flexion: 40000,
      certification: 'LWG',
    },
    cuir_bicolore: {
      label: 'Cuir bicolore',
      epaisseur: { min: 1.0, max: 1.6, unite: 'mm' },
      usages: ['tige'],
      segments: ['femme', 'homme'],
      resistance_flexion: 45000,
      certification: 'LWG',
    },
    cuir_cire: {
      label: 'Cuir Verni',
      epaisseur: { min: 1.2, max: 1.8, unite: 'mm' },
      usages: ['tige'],
      segments: ['femme', 'homme'],
      resistance_flexion: 48000,
      certification: 'LWG',
    },
    cuir_waterproof: {
      label: 'Cuir waterproof (DWR traité)',
      epaisseur: { min: 1.2, max: 1.8, unite: 'mm' },
      usages: ['tige'],
      segments: ['femme', 'homme', 'enfant'],
      resistance_flexion: 50000,
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
    neoprene: {
      label: 'Néoprène',
      epaisseur: { min: 1.0, max: 3.0, unite: 'mm' },
      usages: ['tige', 'col'],
      segments: ['femme', 'homme'],
      resistance_flexion: 70000,
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
    canvas: {
      label: 'Canvas',
      epaisseur: { min: 0.6, max: 1.2, unite: 'mm' },
      usages: ['tige'],
      segments: ['enfant', 'femme', 'homme'],
      resistance_flexion: 45000,
      certification: 'OEKO-TEX',
    },
    denim: {
      label: 'Denim',
      epaisseur: { min: 0.8, max: 1.4, unite: 'mm' },
      usages: ['tige'],
      segments: ['femme', 'homme'],
      resistance_flexion: 35000,
      certification: null,
    },
    knit: {
      label: 'Knit technique',
      epaisseur: { min: 0.3, max: 0.8, unite: 'mm' },
      usages: ['tige'],
      segments: ['femme', 'homme', 'enfant'],
      resistance_flexion: 90000,
      certification: null,
    },
    toile_enduite: {
      label: 'Toile enduite',
      epaisseur: { min: 0.6, max: 1.2, unite: 'mm' },
      usages: ['tige'],
      segments: ['femme', 'homme'],
      resistance_flexion: 50000,
      certification: null,
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
    vibram: {
      label: 'Vibram (premium outdoor)',
      densite: { min: 1.0, max: 1.3 },
      durete_shore: { min: 60, max: 80, echelle: 'A' },
      usure_din: { max: 70, unite: 'mm³' },
      segments: ['homme', 'femme'],
    },
    pu_bi_densite: {
      label: 'PU bi-densité',
      densite: { min: 0.4, max: 0.8 },
      durete_shore: { min: 45, max: 65, echelle: 'A' },
      usure_din: { max: 110, unite: 'mm³' },
      segments: ['femme', 'homme'],
    },
    plateforme_liege: {
      label: 'Plateforme liège/bois',
      densite: { min: 0.3, max: 0.5 },
      durete_shore: { min: 60, max: 80, echelle: 'A' },
      usure_din: { max: 200, unite: 'mm³' },
      segments: ['femme'],
    },
    texon: {
      label: 'Cuir reconstitué (Texon)',
      densite: { min: 0.7, max: 0.9 },
      durete_shore: { min: 65, max: 85, echelle: 'A' },
      usure_din: { max: 250, unite: 'mm³' },
      segments: ['femme', 'homme'],
    },
    orthopedique: {
      label: 'Semelle orthopédique amovible',
      densite: { min: 0.2, max: 0.5 },
      durete_shore: { min: 25, max: 45, echelle: 'C' },
      usure_din: { max: 300, unite: 'mm³' },
      segments: ['bebe', 'enfant', 'femme', 'homme'],
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
  strobel: {
    label: 'Strobel (sport/sneaker)',
    description: 'Tige cousue à une semelle souple, typique sneaker',
    segments: ['enfant', 'femme', 'homme'],
    cout_relatif: 1.5,
    flexibilite: 'très haute',
    reparabilite: 'faible',
  },
  ago: {
    label: 'Ago (mocassin californien)',
    description: 'Semelle retournée et collée, construction souple',
    segments: ['femme', 'homme'],
    cout_relatif: 2,
    flexibilite: 'très haute',
    reparabilite: 'moyenne',
  },
  norwegian_welt: {
    label: 'Norwegian welt (outdoor)',
    description: 'Trépointe retournée vers l\'extérieur, double couture, très étanche',
    segments: ['homme'],
    cout_relatif: 4.5,
    flexibilite: 'faible',
    reparabilite: 'très haute',
  },
}

export const doublures = {
  chevre_naturelle: {
    label: 'Chèvre naturelle (premium)',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 25, premium: 60 },
  },
  veau_velours: {
    label: 'Veau velours (luxe)',
    segments: ['homme'],
    price_mad_pair: { local: 40, premium: 90 },
  },
  textile_coton_bio: {
    label: 'Textile coton bio (bébé/enfant)',
    segments: ['bebe', 'enfant'],
    price_mad_pair: { local: 8, premium: 20 },
  },
  microfibre_respirante: {
    label: 'Microfibre respirante',
    segments: ['bebe', 'enfant', 'femme', 'homme'],
    price_mad_pair: { local: 10, premium: 25 },
  },
  laine_merinos: {
    label: 'Laine mérinos (hiver)',
    segments: ['femme', 'homme', 'enfant'],
    price_mad_pair: { local: 30, premium: 65 },
  },
  fourrure_synthetique: {
    label: 'Fourrure synthétique (hiver)',
    segments: ['femme', 'enfant'],
    price_mad_pair: { local: 15, premium: 35 },
  },
  lin_naturel: {
    label: 'Lin naturel (été)',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 12, premium: 30 },
  },
  cuir_vegetal_recycle: {
    label: 'Cuir végétal recyclé',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 20, premium: 50 },
  },
  sans_doublure: {
    label: 'Sans doublure (unlined — été)',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 0, premium: 0 },
  },
}

export const renforts = {
  contrefort_thermo: {
    label: 'Contrefort thermoplastique',
    segments: ['enfant', 'femme', 'homme'],
    price_mad_pair: { local: 5, premium: 12 },
  },
  contrefort_cuir: {
    label: 'Contrefort cuir (premium)',
    segments: ['homme'],
    price_mad_pair: { local: 15, premium: 35 },
  },
  bout_dur_thermo: {
    label: 'Bout dur thermoplastique',
    segments: ['enfant', 'femme', 'homme'],
    price_mad_pair: { local: 4, premium: 10 },
  },
  bout_dur_acier: {
    label: 'Bout dur acier',
    segments: ['homme'],
    price_mad_pair: { local: 12, premium: 25 },
  },
  cambrion_acier: {
    label: 'Cambrion acier',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 6, premium: 15 },
  },
  cambrion_bois: {
    label: 'Cambrion bois (premium)',
    segments: ['homme'],
    price_mad_pair: { local: 10, premium: 25 },
  },
  cambrion_carbone: {
    label: 'Cambrion fibre carbone',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 20, premium: 50 },
  },
  semelle_int_mousse: {
    label: 'Semelle intérieure mousse mémoire',
    segments: ['femme', 'homme', 'enfant'],
    price_mad_pair: { local: 8, premium: 20 },
  },
  semelle_int_liege: {
    label: 'Semelle intérieure liège',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 12, premium: 30 },
  },
  semelle_int_cuir: {
    label: 'Semelle intérieure cuir',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 15, premium: 40 },
  },
}

export const fermetures = {
  lacets_ronds_cires: {
    label: 'Lacets ronds cirés',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 3, premium: 8 },
  },
  lacets_plats: {
    label: 'Lacets plats',
    segments: ['enfant', 'femme', 'homme'],
    price_mad_pair: { local: 2, premium: 5 },
  },
  velcro: {
    label: 'Velcro (enfant/bébé)',
    segments: ['bebe', 'enfant'],
    price_mad_pair: { local: 3, premium: 6 },
  },
  boucle_metal: {
    label: 'Boucle métal',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 8, premium: 25 },
  },
  zip_lateral: {
    label: 'Zip latéral',
    segments: ['femme', 'homme', 'enfant'],
    price_mad_pair: { local: 6, premium: 15 },
  },
  zip_interieur: {
    label: 'Zip intérieur discret',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 8, premium: 18 },
  },
  elastique_chelsea: {
    label: 'Élastique (chelsea)',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 5, premium: 12 },
  },
  scratch: {
    label: 'Scratch (bébé premiers pas)',
    segments: ['bebe'],
    price_mad_pair: { local: 2, premium: 5 },
  },
  bouton_pression: {
    label: 'Bouton-pression',
    segments: ['bebe', 'enfant'],
    price_mad_pair: { local: 3, premium: 7 },
  },
  bride_cheville: {
    label: 'Bride cheville',
    segments: ['femme'],
    price_mad_pair: { local: 6, premium: 15 },
  },
}

export const ornements = {
  brogue_perforations: {
    label: 'Brogue perforations',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 10, premium: 25 },
  },
  medallion: {
    label: 'Medallion (cap toe)',
    segments: ['homme'],
    price_mad_pair: { local: 12, premium: 30 },
  },
  tassel: {
    label: 'Tassel (gland)',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 8, premium: 20 },
  },
  kiltie: {
    label: 'Kiltie',
    segments: ['homme'],
    price_mad_pair: { local: 10, premium: 22 },
  },
  monk_strap_1: {
    label: 'Monk strap 1 boucle',
    segments: ['homme'],
    price_mad_pair: { local: 15, premium: 40 },
  },
  monk_strap_2: {
    label: 'Monk strap 2 boucles',
    segments: ['homme'],
    price_mad_pair: { local: 20, premium: 50 },
  },
  couture_blake_visible: {
    label: 'Couture Blake visible (décorative)',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 8, premium: 18 },
  },
  liseres_contrastes: {
    label: 'Liserés contrastés',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 5, premium: 12 },
  },
  logo_embosse: {
    label: 'Logo discret embossé',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 3, premium: 8 },
  },
  clous_decoratifs: {
    label: 'Clous décoratifs',
    segments: ['femme', 'homme'],
    price_mad_pair: { local: 6, premium: 15 },
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
 * INTENTION_MAP — mapping mots-clés utilisateur vers spécifications
 * confidence >= 0.80 → sortie statique, zéro token API
 * confidence < 0.80 → escalade Claude API dans enrichmentService
 */
export const INTENTION_MAP = {
  // --- STYLES ---
  mocassin: { semelle: 'cuir_semelle', montage: 'ago', material: 'veau', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.92, prompt_descriptor: 'loafer shoe, flat heel, slip-on, moccasin construction' },
  loafer: { semelle: 'cuir_semelle', montage: 'ago', material: 'veau', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.92, prompt_descriptor: 'loafer shoe, flat heel, slip-on, moccasin construction' },
  derby: { semelle: 'cuir_semelle', montage: 'cousu_blake', material: 'vachette', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.95, prompt_descriptor: 'oxford derby shoe, open lacing, leather formal shoe, round toe' },
  richelieu: { semelle: 'cuir_semelle', montage: 'cousu_goodyear', material: 'box_calf', finition: 'cire', doublure: 'veau_velours', confidence: 0.95, prompt_descriptor: 'oxford shoe, closed lacing, cap toe, leather formal dress shoe' },
  oxford: { semelle: 'cuir_semelle', montage: 'cousu_goodyear', material: 'box_calf', finition: 'cire', doublure: 'veau_velours', confidence: 0.95, prompt_descriptor: 'oxford shoe, closed lacing, cap toe, leather formal dress shoe' },
  chelsea: { semelle: 'caoutchouc', montage: 'cousu_blake', material: 'veau', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.93, prompt_descriptor: 'chelsea boot, elastic side panel, ankle boot, pull-on, round toe' },
  bottine: { semelle: 'tr', montage: 'cousu_blake', material: 'vachette', finition: 'cire', doublure: 'microfibre_respirante', confidence: 0.88, prompt_descriptor: 'ankle boot, lace-up or zip, low to mid heel, leather boot' },
  botte: { semelle: 'caoutchouc', montage: 'colle', material: 'vachette', finition: 'hydrofuge', doublure: 'laine_merinos', confidence: 0.85, prompt_descriptor: 'tall boot, knee-high, leather riding boot, low heel' },
  escarpin: { semelle: 'cuir_semelle', montage: 'colle', material: 'chevreau', finition: 'vernis', doublure: 'chevre_naturelle', confidence: 0.90, prompt_descriptor: 'stiletto heel pump, needle-thin high heel, pointed toe, women\'s formal shoe' },
  ballerine: { semelle: 'eva', montage: 'colle', material: 'agneau', finition: 'cire', doublure: 'microfibre_respirante', confidence: 0.88, prompt_descriptor: 'ballet flat shoe, round toe, very low heel, women\'s flat, bow detail' },
  sandale: { semelle: 'eva', montage: 'colle', material: 'vachette', finition: 'naturel', doublure: 'sans_doublure', confidence: 0.85, prompt_descriptor: 'open toe sandal, strappy, flat or low heel, summer shoe' },
  sneaker: { semelle: 'eva', montage: 'strobel', material: 'mesh', finition: 'neutre', doublure: 'microfibre_respirante', confidence: 0.92, prompt_descriptor: 'athletic sneaker, cushioned sole, lace-up, sporty silhouette' },
  basket: { semelle: 'eva', montage: 'strobel', material: 'mesh', finition: 'neutre', doublure: 'microfibre_respirante', confidence: 0.90, prompt_descriptor: 'casual sneaker, thick sole, lace-up, streetwear style' },
  trail: { semelle: 'vibram', montage: 'injection', material: 'cuir_waterproof', finition: 'hydrofuge', doublure: 'microfibre_respirante', confidence: 0.88, prompt_descriptor: 'trail running shoe, aggressive tread sole, waterproof, outdoor' },
  randonnee: { semelle: 'vibram', montage: 'norwegian_welt', material: 'cuir_gras', finition: 'hydrofuge', doublure: 'laine_merinos', confidence: 0.85, prompt_descriptor: 'hiking boot, high ankle, heavy tread sole, mountain boot' },
  chausson: { semelle: 'eva', montage: 'cousu_strobel', material: 'agneau', finition: 'naturel', doublure: 'textile_coton_bio', confidence: 0.92, prompt_descriptor: 'baby bootie, soft sole, rounded shape, infant first shoe' },
  pantoufle: { semelle: 'eva', montage: 'colle', material: 'agneau', finition: 'naturel', doublure: 'fourrure_synthetique', confidence: 0.85, prompt_descriptor: 'house slipper, soft padded sole, cozy indoor shoe' },
  mule: { semelle: 'cuir_semelle', montage: 'colle', material: 'chevreau', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.82, prompt_descriptor: 'mule shoe, open back, slip-on, mid to high heel' },
  monk: { semelle: 'cuir_semelle', montage: 'cousu_goodyear', material: 'box_calf', finition: 'cire', doublure: 'veau_velours', confidence: 0.90, prompt_descriptor: 'monk strap shoe, buckle closure, no laces, leather dress shoe' },
  brogue: { semelle: 'cuir_semelle', montage: 'cousu_goodyear', material: 'cuir_perfore', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.93, prompt_descriptor: 'brogue shoe, decorative perforations, wingtip, medallion cap toe' },
  desert_boot: { semelle: 'caoutchouc', montage: 'cousu_blake', material: 'nubuck', finition: 'naturel', doublure: 'sans_doublure', confidence: 0.88, prompt_descriptor: 'desert boot, suede ankle boot, crepe sole, 2-3 eyelets' },
  chukka: { semelle: 'caoutchouc', montage: 'cousu_blake', material: 'veau', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.85, prompt_descriptor: 'chukka boot, leather ankle boot, 2 eyelets, round toe' },
  // --- STYLES AJOUTÉS ---
  botte_haute: { semelle: 'caoutchouc', montage: 'colle', material: 'vachette', finition: 'cire', doublure: 'microfibre_respirante', confidence: 0.85, prompt_descriptor: 'tall knee-high boot, full-length zip, leather, low heel' },
  cuissarde: { semelle: 'tr', montage: 'colle', material: 'veau', finition: 'cire', doublure: 'microfibre_respirante', confidence: 0.82, prompt_descriptor: 'over-the-knee thigh-high boot, stretch panel, high heel' },
  sabot: { semelle: 'plateforme_liege', montage: 'colle', material: 'vachette', finition: 'naturel', doublure: 'sans_doublure', confidence: 0.80, prompt_descriptor: 'clog shoe, wooden platform sole, closed toe, open back' },
  tong: { semelle: 'eva', montage: 'colle', material: 'pu', finition: 'naturel', doublure: 'sans_doublure', confidence: 0.80, prompt_descriptor: 'flip-flop sandal, thong strap, flat sole, casual beach shoe' },
  espadrille: { semelle: 'plateforme_liege', montage: 'colle', material: 'toile', finition: 'naturel', doublure: 'sans_doublure', confidence: 0.82, prompt_descriptor: 'espadrille shoe, jute rope sole, canvas upper, Mediterranean style' },
  babouche: { semelle: 'eva', montage: 'cousu_strobel', material: 'agneau', finition: 'naturel', doublure: 'textile_coton_bio', confidence: 0.80, prompt_descriptor: 'babouche slipper, soft leather, pointed toe, Moroccan style' },
  sandale_compensee: { semelle: 'plateforme_liege', montage: 'colle', material: 'vachette', finition: 'naturel', doublure: 'sans_doublure', confidence: 0.82, prompt_descriptor: 'wedge sandal, cork platform sole, strappy, summer shoe' },
  plateforme: { semelle: 'plateforme_liege', montage: 'colle', material: 'vachette', finition: 'cire', doublure: 'microfibre_respirante', confidence: 0.80, prompt_descriptor: 'platform shoe, thick elevated sole, chunky silhouette' },
  mary_jane: { semelle: 'cuir_semelle', montage: 'colle', material: 'chevreau', finition: 'vernis', doublure: 'chevre_naturelle', confidence: 0.85, prompt_descriptor: 'Mary Jane shoe, rounded toe, single strap with buckle, low heel' },
  slingback: { semelle: 'cuir_semelle', montage: 'colle', material: 'chevreau', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.82, prompt_descriptor: 'slingback pump, open back with strap, pointed toe, mid heel' },
  peep_toe: { semelle: 'cuir_semelle', montage: 'colle', material: 'chevreau', finition: 'vernis', doublure: 'chevre_naturelle', confidence: 0.82, prompt_descriptor: 'peep-toe pump, open front toe, high heel, evening shoe' },
  gladiateur: { semelle: 'eva', montage: 'colle', material: 'vachette', finition: 'naturel', doublure: 'sans_doublure', confidence: 0.80, prompt_descriptor: 'gladiator sandal, multiple straps up the leg, flat or low heel' },
  boot_cowboy: { semelle: 'cuir_semelle', montage: 'cousu_goodyear', material: 'vachette', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.85, prompt_descriptor: 'cowboy boot, Western boot, pointed toe, stacked heel, pull-on tabs' },
  botte_equitation: { semelle: 'caoutchouc', montage: 'cousu_blake', material: 'vachette', finition: 'cire', doublure: 'microfibre_respirante', confidence: 0.85, prompt_descriptor: 'riding boot, tall shaft, flat heel, equestrian style' },
  running: { semelle: 'eva', montage: 'strobel', material: 'mesh', finition: 'neutre', doublure: 'microfibre_respirante', confidence: 0.90, prompt_descriptor: 'running shoe, cushioned midsole, breathable upper, athletic' },
  // --- OCCASIONS ---
  mariage: { semelle: 'cuir_semelle', montage: 'cousu_blake', material: 'chevreau', finition: 'vernis', doublure: 'chevre_naturelle', confidence: 0.88 },
  soiree: { semelle: 'cuir_semelle', montage: 'colle', material: 'chevreau', finition: 'vernis', doublure: 'chevre_naturelle', confidence: 0.85 },
  bureau: { semelle: 'cuir_semelle', montage: 'cousu_blake', material: 'veau', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.90 },
  casual: { semelle: 'eva', montage: 'colle', material: 'nubuck', finition: 'naturel', doublure: 'microfibre_respirante', confidence: 0.82 },
  plage: { semelle: 'eva', montage: 'colle', material: 'toile', finition: 'naturel', doublure: 'sans_doublure', confidence: 0.80 },
  pluie: { semelle: 'caoutchouc', montage: 'injection', material: 'cuir_waterproof', finition: 'hydrofuge', doublure: 'microfibre_respirante', confidence: 0.88 },
  neige: { semelle: 'vibram', montage: 'injection', material: 'cuir_waterproof', finition: 'hydrofuge', doublure: 'laine_merinos', confidence: 0.85 },
  sport: { semelle: 'eva', montage: 'strobel', material: 'mesh', finition: 'neutre', doublure: 'microfibre_respirante', confidence: 0.90 },
  grossesse: { semelle: 'eva', montage: 'colle', material: 'agneau', finition: 'naturel', doublure: 'microfibre_respirante', confidence: 0.78 },
  // --- SENSATIONS / QUALITÉS ---
  confortable: { semelle: 'eva', montage: 'strobel', material: 'veau', finition: 'naturel', doublure: 'microfibre_respirante', confidence: 0.82 },
  leger: { semelle: 'eva', montage: 'strobel', material: 'knit', finition: 'neutre', doublure: 'microfibre_respirante', confidence: 0.85 },
  waterproof: { semelle: 'vibram', montage: 'injection', material: 'cuir_waterproof', finition: 'hydrofuge', doublure: 'microfibre_respirante', confidence: 0.90 },
  vintage: { semelle: 'cuir_semelle', montage: 'cousu_goodyear', material: 'cuir_cire', finition: 'antique', doublure: 'chevre_naturelle', confidence: 0.85 },
  minimaliste: { semelle: 'eva', montage: 'colle', material: 'veau', finition: 'naturel', doublure: 'sans_doublure', confidence: 0.80 },
  luxe: { semelle: 'cuir_semelle', montage: 'cousu_goodyear', material: 'cordovan', finition: 'cire', doublure: 'veau_velours', confidence: 0.92 },
  artisanal: { semelle: 'cuir_semelle', montage: 'cousu_goodyear', material: 'vachetta', finition: 'cire', doublure: 'chevre_naturelle', confidence: 0.88 },
  vegan: { semelle: 'eva', montage: 'colle', material: 'microfibre', finition: 'neutre', doublure: 'microfibre_respirante', confidence: 0.82 },
  recycle: { semelle: 'eva', montage: 'colle', material: 'canvas', finition: 'naturel', doublure: 'cuir_vegetal_recycle', confidence: 0.78 },
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

/**
 * Retourne le label français lisible d'un matériau, montage ou semelle par son id
 * Cherche dans materiaux, montages, semelles, doublures, renforts, fermetures, ornements
 */
export function getLabelFr(id) {
  if (!id) return null
  // Materiaux
  for (const cat of Object.values(materiaux)) {
    if (cat[id]) return cat[id].label
  }
  // Montages
  if (montages[id]) return montages[id].label
  // Semelles
  if (semelles.types[id]) return semelles.types[id].label
  // Doublures
  if (typeof doublures !== 'undefined' && doublures[id]) return doublures[id].label
  // Fallback: capitalize id
  return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
