/**
 * Service CRUD pour l'historique des fiches techniques
 * Persistance via localStorage
 */

const STORAGE_KEY = 'atelier_ia_history'

/**
 * Récupère tout l'historique
 * @returns {Array<object>}
 */
export function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Récupère une fiche par son ID
 * @param {string} id
 * @returns {object|null}
 */
export function getById(id) {
  return getAll().find(item => item.id === id) || null
}

/**
 * Crée une nouvelle entrée
 * @param {object} data - Données de la fiche technique
 * @returns {object} - L'entrée créée avec id et timestamps
 */
export function create(data) {
  const entries = getAll()
  const entry = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  entries.unshift(entry)
  save(entries)
  return entry
}

/**
 * Met à jour une entrée existante
 * @param {string} id
 * @param {object} updates
 * @returns {object|null}
 */
export function update(id, updates) {
  const entries = getAll()
  const index = entries.findIndex(item => item.id === id)
  if (index === -1) return null

  entries[index] = {
    ...entries[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  }
  save(entries)
  return entries[index]
}

/**
 * Supprime une entrée
 * @param {string} id
 * @returns {boolean}
 */
export function remove(id) {
  const entries = getAll()
  const filtered = entries.filter(item => item.id !== id)
  if (filtered.length === entries.length) return false
  save(filtered)
  return true
}

/**
 * Supprime tout l'historique
 */
export function clearAll() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Recherche dans l'historique
 * @param {string} query
 * @returns {Array<object>}
 */
export function search(query) {
  const q = query.toLowerCase()
  return getAll().filter(item => {
    const searchable = JSON.stringify(item).toLowerCase()
    return searchable.includes(q)
  })
}

/**
 * Retourne les N dernières entrées
 * @param {number} n
 * @returns {Array<object>}
 */
export function getRecent(n = 5) {
  return getAll().slice(0, n)
}

/**
 * Exporte l'historique en JSON
 * @returns {string}
 */
export function exportJSON() {
  return JSON.stringify(getAll(), null, 2)
}

/**
 * Importe un historique JSON
 * @param {string} json
 * @returns {number} nombre d'entrées importées
 */
export function importJSON(json) {
  const data = JSON.parse(json)
  if (!Array.isArray(data)) throw new Error('Format invalide')
  save(data)
  return data.length
}

// --- Helpers privés ---

function save(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function generateId() {
  return `ft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
