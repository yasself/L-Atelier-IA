/**
 * Base de données fournisseurs enrichie
 * Prix en MAD/m² (ou MAD/paire pour semelles), MOQ, délais, certifications
 */

export const fournisseurs = {
  cuir: [
    {
      id: 'tan-maroc-01',
      nom: 'Tannerie de Fès',
      pays: 'Maroc',
      ville: 'Fès',
      specialite: 'Cuir vachette / veau',
      prix_mad_m2: { min: 80, max: 180 },
      moq: 500,
      moq_unite: 'm²',
      delai_jours: 15,
      certification: ['LWG Silver'],
      qualite: 'standard',
      export: false,
    },
    {
      id: 'tan-maroc-02',
      nom: 'Tannerie Atlas Leather',
      pays: 'Maroc',
      ville: 'Casablanca',
      specialite: 'Cuir chevreau / agneau',
      prix_mad_m2: { min: 120, max: 280 },
      moq: 300,
      moq_unite: 'm²',
      delai_jours: 12,
      certification: ['LWG Gold', 'OEKO-TEX'],
      qualite: 'premium',
      export: true,
    },
    {
      id: 'tan-it-01',
      nom: 'Conceria Walpier',
      pays: 'Italie',
      ville: 'Santa Croce sull\'Arno',
      specialite: 'Cuir veau végétal',
      prix_mad_m2: { min: 350, max: 650 },
      moq: 200,
      moq_unite: 'm²',
      delai_jours: 25,
      certification: ['LWG Gold', 'Pelle Conciata al Vegetale'],
      qualite: 'luxe',
      export: true,
    },
    {
      id: 'tan-es-01',
      nom: 'Curtidos Treviño',
      pays: 'Espagne',
      ville: 'Igualada',
      specialite: 'Nubuck / vachette',
      prix_mad_m2: { min: 250, max: 450 },
      moq: 300,
      moq_unite: 'm²',
      delai_jours: 20,
      certification: ['LWG Silver', 'ISO 14001'],
      qualite: 'premium',
      export: true,
    },
    {
      id: 'tan-pt-01',
      nom: 'Marsul Curtumes',
      pays: 'Portugal',
      ville: 'Alcanena',
      specialite: 'Cuir vachette souple',
      prix_mad_m2: { min: 220, max: 400 },
      moq: 250,
      moq_unite: 'm²',
      delai_jours: 18,
      certification: ['LWG Gold'],
      qualite: 'premium',
      export: true,
    },
  ],
  synthetique: [
    {
      id: 'syn-cn-01',
      nom: 'Huafon Microfibre',
      pays: 'Chine',
      ville: 'Wenzhou',
      specialite: 'Microfibre / PU',
      prix_mad_m2: { min: 35, max: 90 },
      moq: 1000,
      moq_unite: 'm²',
      delai_jours: 35,
      certification: ['OEKO-TEX Standard 100'],
      qualite: 'standard',
      export: true,
    },
    {
      id: 'syn-maroc-01',
      nom: 'Simcuir Maroc',
      pays: 'Maroc',
      ville: 'Casablanca',
      specialite: 'PU haute qualité',
      prix_mad_m2: { min: 55, max: 120 },
      moq: 500,
      moq_unite: 'm²',
      delai_jours: 10,
      certification: ['REACH'],
      qualite: 'standard',
      export: false,
    },
  ],
  semelles: [
    {
      id: 'sem-maroc-01',
      nom: 'Semellerie du Détroit',
      pays: 'Maroc',
      ville: 'Tanger',
      specialite: 'TR / EVA injection',
      prix_mad_paire: { min: 15, max: 45 },
      moq: 2000,
      moq_unite: 'paires',
      delai_jours: 12,
      certification: ['ISO 9001'],
      qualite: 'standard',
      export: false,
    },
    {
      id: 'sem-it-01',
      nom: 'Finproject (XL EXTRALIGHT)',
      pays: 'Italie',
      ville: 'Morrovalle',
      specialite: 'EVA ultra-légère / TPU',
      prix_mad_paire: { min: 60, max: 150 },
      moq: 500,
      moq_unite: 'paires',
      delai_jours: 30,
      certification: ['ISO 14001', 'OEKO-TEX'],
      qualite: 'luxe',
      export: true,
    },
    {
      id: 'sem-es-01',
      nom: 'Gomez Plasticos',
      pays: 'Espagne',
      ville: 'Elche',
      specialite: 'TR / Caoutchouc',
      prix_mad_paire: { min: 40, max: 90 },
      moq: 1000,
      moq_unite: 'paires',
      delai_jours: 22,
      certification: ['ISO 9001'],
      qualite: 'premium',
      export: true,
    },
  ],
  accessoires: [
    {
      id: 'acc-maroc-01',
      nom: 'Fournitures Derb Omar',
      pays: 'Maroc',
      ville: 'Casablanca',
      specialite: 'Boucles, oeillets, zips, lacets',
      prix_mad_unite: { min: 0.5, max: 15 },
      moq: 5000,
      moq_unite: 'pièces',
      delai_jours: 7,
      certification: [],
      qualite: 'standard',
      export: false,
    },
    {
      id: 'acc-it-01',
      nom: 'A.P. Lavorazioni Metalliche',
      pays: 'Italie',
      ville: 'Firenze',
      specialite: 'Boucles laiton, accessoires premium',
      prix_mad_unite: { min: 8, max: 50 },
      moq: 1000,
      moq_unite: 'pièces',
      delai_jours: 25,
      certification: ['REACH', 'Nickel-free'],
      qualite: 'luxe',
      export: true,
    },
  ],
}

/**
 * Filtre les fournisseurs par catégorie et mode (maroc / export)
 */
export function getFournisseurs(categorie, mode = 'tous') {
  const liste = fournisseurs[categorie] || []
  if (mode === 'maroc') return liste.filter(f => f.pays === 'Maroc')
  if (mode === 'export') return liste.filter(f => f.export === true)
  return liste
}

/**
 * Recherche fournisseur par id
 */
export function getFournisseurById(id) {
  for (const liste of Object.values(fournisseurs)) {
    const found = liste.find(f => f.id === id)
    if (found) return found
  }
  return null
}

/**
 * Calcule le coût matière estimé pour une paire
 * @param {string} categorie - cuir, synthetique, semelles
 * @param {string} fournisseurId - ID du fournisseur
 * @param {number} surface - surface en m² (ou 1 pour semelles)
 * @returns {{ min: number, max: number, devise: string }}
 */
export function estimerCoutMatiere(categorie, fournisseurId, surface = 0.25) {
  const f = getFournisseurById(fournisseurId)
  if (!f) return null

  const prix = f.prix_mad_m2 || f.prix_mad_paire || f.prix_mad_unite
  if (!prix) return null

  return {
    min: Math.round(prix.min * surface),
    max: Math.round(prix.max * surface),
    devise: 'MAD',
  }
}

/**
 * Retourne toutes les catégories disponibles
 */
export function getCategories() {
  return Object.keys(fournisseurs)
}
