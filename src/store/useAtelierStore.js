import { create } from 'zustand'

const useAtelierStore = create((set, get) => ({
  // Segment sélectionné
  segment: 'femme',
  setSegment: (segment) => set({ segment }),

  // Configuration produit en cours
  config: {
    type_chaussure: '',
    materiau_tige: '',
    couleur: '',
    couleurs_secondaires: [],
    montage: '',
    semelle_type: '',
    style: '',
    finitions: '',
    angle: '3/4 front view',
    budget: '',
  },
  setConfig: (updates) => set((state) => ({
    config: { ...state.config, ...updates },
  })),
  resetConfig: () => set({
    config: {
      type_chaussure: '',
      materiau_tige: '',
      couleur: '',
      couleurs_secondaires: [],
      montage: '',
      semelle_type: '',
      style: '',
      finitions: '',
      angle: '3/4 front view',
      budget: '',
    },
  }),

  // Mode sourcing
  sourcingMode: 'maroc',
  setSourcingMode: (mode) => set({ sourcingMode: mode }),

  // Résultat d'enrichissement
  enrichmentResult: null,
  setEnrichmentResult: (result) => set({ enrichmentResult: result }),

  // Prompt généré
  generatedPrompt: null,
  setGeneratedPrompt: (prompt) => set({ generatedPrompt: prompt }),

  // Historique (cache local)
  history: [],
  setHistory: (history) => set({ history }),
  addToHistory: (entry) => set((state) => ({
    history: [entry, ...state.history],
  })),

  // UI state
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  activeView: 'generator',
  setActiveView: (view) => set({ activeView: view }),

  // Loading state
  loading: false,
  setLoading: (loading) => set({ loading }),
}))

export default useAtelierStore
