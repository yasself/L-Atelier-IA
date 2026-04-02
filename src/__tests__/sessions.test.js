import { describe, it, expect, beforeEach } from 'vitest'
import useAtelierStore from '../store/useAtelierStore'

describe('Multi-Session System', () => {
  beforeEach(() => {
    useAtelierStore.getState().reset()
  })

  describe('addSession', () => {
    it('should start with 1 session', () => {
      const { sessions } = useAtelierStore.getState()
      expect(sessions.length).toBe(1)
    })

    it('should add a new session', () => {
      useAtelierStore.getState().addSession()
      expect(useAtelierStore.getState().sessions.length).toBe(2)
    })

    it('should not exceed 6 sessions', () => {
      for (let i = 0; i < 10; i++) useAtelierStore.getState().addSession()
      expect(useAtelierStore.getState().sessions.length).toBeLessThanOrEqual(6)
    })

    it('should generate unique session ids', () => {
      useAtelierStore.getState().addSession()
      useAtelierStore.getState().addSession()
      const ids = useAtelierStore.getState().sessions.map(s => s.id)
      const unique = new Set(ids)
      expect(unique.size).toBe(ids.length)
    })
  })

  describe('removeSession', () => {
    it('should not remove the last session', () => {
      const firstId = useAtelierStore.getState().sessions[0].id
      useAtelierStore.getState().removeSession(firstId)
      expect(useAtelierStore.getState().sessions.length).toBeGreaterThanOrEqual(1)
    })

    it('should remove a session and switch active if needed', () => {
      useAtelierStore.getState().addSession()
      const sessions = useAtelierStore.getState().sessions
      const secondId = sessions[sessions.length - 1].id
      useAtelierStore.getState().setActiveSession(secondId)
      useAtelierStore.getState().removeSession(secondId)
      const after = useAtelierStore.getState()
      expect(after.sessions.length).toBe(1)
      expect(after.activeSessionId).toBe(after.sessions[0].id)
    })
  })

  describe('session isolation', () => {
    it('should update only active session when setSegment is called', () => {
      useAtelierStore.getState().addSession()
      const sessions = useAtelierStore.getState().sessions
      const id1 = sessions[0].id
      const id2 = sessions[sessions.length - 1].id

      // Set segment in session 1
      useAtelierStore.getState().setActiveSession(id1)
      useAtelierStore.getState().setSegment('bebe')

      // Switch to session 2 and set different segment
      useAtelierStore.getState().setActiveSession(id2)
      useAtelierStore.getState().setSegment('homme')

      // Verify isolation
      const final = useAtelierStore.getState()
      const s1 = final.sessions.find(s => s.id === id1)
      const s2 = final.sessions.find(s => s.id === id2)
      expect(s1.segment).toBe('bebe')
      expect(s2.segment).toBe('homme')
    })
  })
})
