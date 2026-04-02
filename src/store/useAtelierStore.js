import { create } from 'zustand'

const DEFAULT_CONFIG = {
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
}

const DEFAULT_SESSION_DATA = {
  segment: 'femme',
  config: { ...DEFAULT_CONFIG },
  enrichmentResult: null,
  currentSpecs: null,
  generatedPrompt: null,
  currentPrompt: null,
  renderResults: [],
  renderStatus: 'idle',
  totalRenderCost: 0,
  prixEstime: null,
  visionResult: null,
  isGenerating: false,
}

function makeSession(id, label) {
  return {
    id,
    label,
    ...DEFAULT_SESSION_DATA,
    config: { ...DEFAULT_CONFIG },
    renderResults: [],
  }
}

// Helper: update a session in the array and sync flat props for the active session
function updateActiveSession(state, patch) {
  const sessions = state.sessions.map((s) =>
    s.id === state.activeSessionId ? { ...s, ...patch } : s
  )
  return { sessions, ...patch }
}

const useAtelierStore = create((set, get) => ({
  // ─── Sessions ─────────────────────────────────────────────────────────────
  sessions: [makeSession('session_1', 'Projet 1')],
  activeSessionId: 'session_1',

  addSession: () =>
    set((state) => {
      if (state.sessions.length >= 6) return {}
      // Save current flat state into active session first
      const currentFlat = {
        segment: state.segment,
        config: state.config,
        enrichmentResult: state.enrichmentResult,
        currentSpecs: state.currentSpecs,
        generatedPrompt: state.generatedPrompt,
        currentPrompt: state.currentPrompt,
        renderResults: state.renderResults,
        renderStatus: state.renderStatus,
        totalRenderCost: state.totalRenderCost,
        prixEstime: state.prixEstime,
        visionResult: state.visionResult,
        isGenerating: state.isGenerating,
      }
      const updatedSessions = state.sessions.map((s) =>
        s.id === state.activeSessionId ? { ...s, ...currentFlat } : s
      )
      const newId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      const newLabel = `Projet ${updatedSessions.length + 1}`
      const newSession = makeSession(newId, newLabel)
      return {
        sessions: [...updatedSessions, newSession],
        activeSessionId: newId,
        // Reset flat props to new session defaults
        ...DEFAULT_SESSION_DATA,
        config: { ...DEFAULT_CONFIG },
        renderResults: [],
      }
    }),

  removeSession: (id) =>
    set((state) => {
      if (state.sessions.length <= 1) return {}
      const remaining = state.sessions.filter((s) => s.id !== id)
      let newActiveId = state.activeSessionId
      let flatPatch = {}
      if (state.activeSessionId === id) {
        // Switch to last remaining session
        const next = remaining[remaining.length - 1]
        newActiveId = next.id
        flatPatch = {
          segment: next.segment,
          config: next.config,
          enrichmentResult: next.enrichmentResult,
          currentSpecs: next.currentSpecs,
          generatedPrompt: next.generatedPrompt,
          currentPrompt: next.currentPrompt,
          renderResults: next.renderResults,
          renderStatus: next.renderStatus,
          totalRenderCost: next.totalRenderCost,
          prixEstime: next.prixEstime,
          visionResult: next.visionResult,
          isGenerating: next.isGenerating,
          loading: next.isGenerating,
        }
      }
      return { sessions: remaining, activeSessionId: newActiveId, ...flatPatch }
    }),

  setActiveSession: (id) =>
    set((state) => {
      if (id === state.activeSessionId) return {}
      // Save current flat state into currently active session
      const currentFlat = {
        segment: state.segment,
        config: state.config,
        enrichmentResult: state.enrichmentResult,
        currentSpecs: state.currentSpecs,
        generatedPrompt: state.generatedPrompt,
        currentPrompt: state.currentPrompt,
        renderResults: state.renderResults,
        renderStatus: state.renderStatus,
        totalRenderCost: state.totalRenderCost,
        prixEstime: state.prixEstime,
        visionResult: state.visionResult,
        isGenerating: state.isGenerating,
      }
      const savedSessions = state.sessions.map((s) =>
        s.id === state.activeSessionId ? { ...s, ...currentFlat } : s
      )
      const target = savedSessions.find((s) => s.id === id)
      if (!target) return {}
      return {
        sessions: savedSessions,
        activeSessionId: id,
        segment: target.segment,
        config: target.config,
        enrichmentResult: target.enrichmentResult,
        currentSpecs: target.currentSpecs,
        generatedPrompt: target.generatedPrompt,
        currentPrompt: target.currentPrompt,
        renderResults: target.renderResults,
        renderStatus: target.renderStatus,
        totalRenderCost: target.totalRenderCost,
        prixEstime: target.prixEstime,
        visionResult: target.visionResult,
        isGenerating: target.isGenerating,
        loading: target.isGenerating,
      }
    }),

  updateSession: (id, patch) =>
    set((state) => {
      const sessions = state.sessions.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      )
      if (id === state.activeSessionId) {
        return { sessions, ...patch }
      }
      return { sessions }
    }),

  getActiveSession: () => {
    const state = get()
    return state.sessions.find((s) => s.id === state.activeSessionId) || state.sessions[0]
  },

  // ─── Flat state (backward compat) ─────────────────────────────────────────
  segment: 'femme',
  setSegment: (segment) =>
    set((state) => updateActiveSession(state, { segment })),
  setActiveSegment: (segment) =>
    set((state) => updateActiveSession(state, { segment })),

  config: { ...DEFAULT_CONFIG },
  setConfig: (updates) =>
    set((state) => {
      const config = { ...state.config, ...updates }
      return updateActiveSession(state, { config })
    }),
  resetConfig: () =>
    set((state) => {
      const config = { ...DEFAULT_CONFIG }
      return updateActiveSession(state, { config })
    }),

  // Mode sourcing (global — not per session)
  sourcingMode: 'maroc',
  setSourcingMode: (mode) => set({ sourcingMode: mode }),

  // Enrichment result (dual names)
  enrichmentResult: null,
  currentSpecs: null,
  setEnrichmentResult: (result) =>
    set((state) =>
      updateActiveSession(state, { enrichmentResult: result, currentSpecs: result })
    ),
  setCurrentSpecs: (specs) =>
    set((state) =>
      updateActiveSession(state, { enrichmentResult: specs, currentSpecs: specs })
    ),

  // Generated prompt (dual names)
  generatedPrompt: null,
  currentPrompt: null,
  setGeneratedPrompt: (prompt) =>
    set((state) =>
      updateActiveSession(state, { generatedPrompt: prompt, currentPrompt: prompt })
    ),
  setCurrentPrompt: (prompt) =>
    set((state) =>
      updateActiveSession(state, { generatedPrompt: prompt, currentPrompt: prompt })
    ),

  // Historique (global cache — not per session)
  history: [],
  setHistory: (history) => set({ history }),
  addToHistory: (entry) =>
    set((state) => ({ history: [entry, ...state.history] })),

  // UI state (global)
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  activeView: 'generator',
  setActiveView: (view) => set({ activeView: view }),

  // Loading state (dual names)
  loading: false,
  isGenerating: false,
  setLoading: (isLoading) =>
    set((state) =>
      updateActiveSession(state, { isGenerating: isLoading, loading: isLoading })
    ),
  setIsGenerating: (isLoading) =>
    set((state) =>
      updateActiveSession(state, { isGenerating: isLoading, loading: isLoading })
    ),

  // Prix estimé
  prixEstime: null,
  setPrixEstime: (prix) =>
    set((state) => updateActiveSession(state, { prixEstime: prix })),

  // Render state
  renderResults: [],
  renderStatus: 'idle',
  totalRenderCost: 0,
  setRenderResults: (results) =>
    set((state) => updateActiveSession(state, { renderResults: results })),
  updateSingleRender: (renderResult) =>
    set((state) => {
      const existing = state.renderResults.filter(
        (r) => !(r.view_id === renderResult.view_id)
      )
      const renderResults = [...existing, renderResult]
      const hasPartial = renderResults.some((r) => r.status === 'success')
      const renderStatus = hasPartial ? 'partial' : state.renderStatus
      const totalRenderCost = renderResults.reduce(
        (sum, r) => sum + (r.cost_usd || 0),
        0
      )
      return updateActiveSession(state, { renderResults, renderStatus, totalRenderCost })
    }),
  setRenderStatus: (renderStatus) =>
    set((state) => updateActiveSession(state, { renderStatus })),
  addRenderCost: (cost) =>
    set((state) => {
      const totalRenderCost = state.totalRenderCost + cost
      return updateActiveSession(state, { totalRenderCost })
    }),
  resetRenders: () =>
    set((state) =>
      updateActiveSession(state, {
        renderResults: [],
        renderStatus: 'idle',
        totalRenderCost: 0,
      })
    ),

  // Input mode (global)
  inputMode: 'text',
  setInputMode: (mode) => set({ inputMode: mode }),

  // Vision result
  visionResult: null,
  setVisionResult: (result) =>
    set((state) => updateActiveSession(state, { visionResult: result })),

  // Reset all (resets everything including sessions)
  reset: () =>
    set(() => ({
      sessions: [makeSession('session_1', 'Projet 1')],
      activeSessionId: 'session_1',
      segment: 'femme',
      config: { ...DEFAULT_CONFIG },
      enrichmentResult: null,
      currentSpecs: null,
      generatedPrompt: null,
      currentPrompt: null,
      renderResults: [],
      renderStatus: 'idle',
      totalRenderCost: 0,
      prixEstime: null,
      visionResult: null,
      isGenerating: false,
      loading: false,
      sourcingMode: 'maroc',
      activeView: 'generator',
      inputMode: 'text',
    })),
}))

export default useAtelierStore
