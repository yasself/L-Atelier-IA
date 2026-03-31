/**
 * Service de configuration — clé unique OpenAI
 * Stocke dans localStorage sous atelier_ia_openai_key
 */

const STORAGE_KEY = 'atelier_ia_openai_key'

export const configService = {
  getOpenAIKey() {
    try {
      return localStorage.getItem(STORAGE_KEY) || null
    } catch {
      return null
    }
  },

  setOpenAIKey(key) {
    try {
      if (key) {
        localStorage.setItem(STORAGE_KEY, key)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // localStorage unavailable
    }
  },

  hasValidConfig() {
    const key = this.getOpenAIKey()
    return Boolean(key && key.length > 10)
  },

  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable
    }
  },
}
