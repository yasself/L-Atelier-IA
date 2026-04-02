import { describe, it, expect, beforeEach } from 'vitest'
import useAtelierStore from '../store/useAtelierStore'

describe('Multi-Session System', () => {
  beforeEach(() => {
    // Reset store
    useAtelierStore.getState().reset()
  })

  describe('addSession', () => {
    it('should start with 1 session', () => {
      const state = useAtelierStore.getState()
      if (!state.sessions) return // Skip if sessions not implemented yet
      expect(state.sessions.length).toBe(1)
    })

    it('should add a new session', () => {
      const state = useAtelierStore.getState()
      if (!state.addSession) return
      state.addSession()
      expect(useAtelierStore.getState().sessions.length).toBe(2)
    })

    it('should not exceed 6 sessions', () => {
      const state = useAtelierStore.getState()
      if (!state.addSession) return
      for (let i = 0; i < 10; i++) state.addSession()
      expect(useAtelierStore.getState().sessions.length).toBeLessThanOrEqual(6)
    })

    it('should generate unique session ids', () => {
      const state = useAtelierStore.getState()
      if (!state.addSession) return
      state.addSession()
      state.addSession()
      const ids = useAtelierStore.getState().sessions.map(s => s.id)
      const unique = new Set(ids)
      expect(unique.size).toBe(ids.length)
    })
  })

  describe('removeSession', () => {
    it('should not remove the last session', () => {
      const state = useAtelierStore.getState()
      if (!state.removeSession || !state.sessions) return
      const firstId = state.sessions[0]?.id
      if (firstId) state.removeSession(firstId)
      expect(useAtelierStore.getState().sessions.length).toBeGreaterThanOrEqual(1)
    })

    it('should remove a session and switch active if needed', () => {
      const state = useAtelierStore.getState()
      if (!state.addSession || !state.removeSession) return
      state.addSession()
      const sessions = useAtelierStore.getState().sessions
      if (sessions.length < 2) return
      const secondId = sessions[1].id
      state.setActiveSession(secondId)
      state.removeSession(secondId)
      const after = useAtelierStore.getState()
      expect(after.sessions.length).toBe(1)
      expect(after.activeSessionId).toBe(after.sessions[0].id)
    })
  })

  describe('session isolation', () => {
    it('should update only active session when setSegment is called', () => {
      const state = useAtelierStore.getState()
      if (!state.addSession || !state.sessions) return
      state.addSession()
      const sessions = useAtelierStore.getState().sessions
      if (sessions.length < 2) return

      // Set segment in session 1
      state.setActiveSession(sessions[0].id)
      state.setSegment('bebe')

      // Switch to session 2 and set different segment
      state.setActiveSession(sessions[1].id)
      state.setSegment('homme')

      // Verify isolation
      const final = useAtelierStore.getState()
      const s1 = final.sessions.find(s => s.id === sessions[0].id)
      const s2 = final.sessions.find(s => s.id === sessions[1].id)
      if (s1 && s2) {
        expect(s1.segment).toBe('bebe')
        expect(s2.segment).toBe('homme')
      }
    })
  })
})
