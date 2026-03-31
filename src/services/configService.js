/**
 * Service de configuration — clés API OpenAI + Replicate
 * Stocke dans localStorage
 */

const OPENAI_KEY = 'atelier_ia_openai_key'
const REPLICATE_KEY = 'atelier_ia_replicate_key'

export const configService = {
  // --- OpenAI ---
  getOpenAIKey() {
    try {
      return localStorage.getItem(OPENAI_KEY) || null
    } catch {
      return null
    }
  },

  setOpenAIKey(key) {
    try {
      if (key) {
        localStorage.setItem(OPENAI_KEY, key)
      } else {
        localStorage.removeItem(OPENAI_KEY)
      }
    } catch {}
  },

  // --- Replicate ---
  getReplicateKey() {
    try {
      return localStorage.getItem(REPLICATE_KEY) || null
    } catch {
      return null
    }
  },

  setReplicateKey(key) {
    try {
      if (key) {
        localStorage.setItem(REPLICATE_KEY, key)
      } else {
        localStorage.removeItem(REPLICATE_KEY)
      }
    } catch {}
  },

  // --- Config checks ---
  hasValidConfig() {
    return this.hasImageEngine()
  },

  hasImageEngine() {
    const openai = this.getOpenAIKey()
    const replicate = this.getReplicateKey()
    return Boolean((openai && openai.length > 10) || (replicate && replicate.length > 10))
  },

  /**
   * Auto-routing : l'utilisateur ne choisit jamais le moteur
   * Replicate présente → flux_pro en primaire
   * Replicate absente → dalle3 uniquement
   */
  getBestEngine() {
    const replicate = this.getReplicateKey()
    if (replicate && replicate.length > 10) return 'flux_pro'
    const openai = this.getOpenAIKey()
    if (openai && openai.length > 10) return 'dalle3'
    return null
  },

  clearAll() {
    try {
      localStorage.removeItem(OPENAI_KEY)
      localStorage.removeItem(REPLICATE_KEY)
    } catch {}
  },
}
