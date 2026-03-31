/**
 * Hook vide, prêt pour auth V2
 * Fournira le contexte utilisateur (profil, préférences, permissions)
 */

import { useState } from 'react'

export default function useUserContext() {
  const [user] = useState(null)
  const [isAuthenticated] = useState(false)
  const [preferences] = useState({
    langue: 'fr',
    devise: 'MAD',
    theme: 'light',
  })

  return {
    user,
    isAuthenticated,
    preferences,
    // Stubs pour V2
    login: async () => {},
    logout: async () => {},
    updatePreferences: async () => {},
  }
}
