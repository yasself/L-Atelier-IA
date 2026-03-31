import { create } from 'zustand'

const useAtelierStore = create((set, get) => ({
  // Segment sélectionné
  segment: 'femme',
  setSegment: (segment) => set({ segment }),
  setActiveSegment: (segment) => set({ segment }),

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

  // Résultat d'enrichissement (dual names)
  enrichmentResult: null,
  currentSpecs: null,
  setEnrichmentResult: (result) => set({ enrichmentResult: result, currentSpecs: result }),
  setCurrentSpecs: (specs) => set({ enrichmentResult: specs, currentSpecs: specs }),

  // Prompt généré (dual names)
  generatedPrompt: null,
  currentPrompt: null,
  setGeneratedPrompt: (prompt) => set({ generatedPrompt: prompt, currentPrompt: prompt }),
  setCurrentPrompt: (prompt) => set({ generatedPrompt: prompt, currentPrompt: prompt }),

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

  // Loading state (dual names)
  loading: false,
  isGenerating: false,
  setLoading: (isLoading) => set({ loading: isLoading, isGenerating: isLoading }),
  setIsGenerating: (isLoading) => set({ loading: isLoading, isGenerating: isLoading }),

  // Prix estimé
  prixEstime: null,
  setPrixEstime: (prix) => set({ prixEstime: prix }),

  // Render state (5 vues — OpenAI DALL-E 3)
  renderResults: [],
  renderStatus: 'idle', // 'idle' | 'generating' | 'partial' | 'complete' | 'error'
  totalRenderCost: 0,
  setRenderResults: (results) => set({ renderResults: results }),
  updateSingleRender: (renderResult) => set((state) => {
    const existing = state.renderResults.filter(
      (r) => !(r.view_id === renderResult.view_id)
    )
    const updated = [...existing, renderResult]
    const hasPartial = updated.some((r) => r.status === 'success')
    return {
      renderResults: updated,
      renderStatus: hasPartial ? 'partial' : state.renderStatus,
      totalRenderCost: updated.reduce((sum, r) => sum + (r.cost_usd || 0), 0),
    }
  }),
  setRenderStatus: (status) => set({ renderStatus: status }),
  addRenderCost: (cost) => set((state) => ({ totalRenderCost: state.totalRenderCost + cost })),
  resetRenders: () => set({ renderResults: [], renderStatus: 'idle', totalRenderCost: 0 }),

  // Input mode
  inputMode: 'text', // 'text' | 'photo' | 'pdf'
  setInputMode: (mode) => set({ inputMode: mode }),

  // Vision analysis result
  visionResult: null,
  setVisionResult: (result) => set({ visionResult: result }),

  // Reset all
  reset: () => set({
    segment: 'femme',
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
    sourcingMode: 'maroc',
    enrichmentResult: null,
    currentSpecs: null,
    generatedPrompt: null,
    currentPrompt: null,
    activeView: 'generator',
    loading: false,
    isGenerating: false,
    prixEstime: null,
    renderResults: [],
    renderStatus: 'idle',
    totalRenderCost: 0,
    inputMode: 'text',
    visionResult: null,
  }),
}))

export default useAtelierStore
