import { getCategories } from '../data/sourcing'

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

export function getRelevantCategories(currentSpecs) {
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
