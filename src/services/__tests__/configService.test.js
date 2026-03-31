/**
 * Tests for configService — OpenAI + Replicate keys + auto-routing
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { configService } from '../configService'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

describe('configService', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('OpenAI key', () => {
    it('should return null when no key is set', () => {
      expect(configService.getOpenAIKey()).toBeNull()
    })

    it('should store and retrieve a key', () => {
      configService.setOpenAIKey('sk-proj-test123456')
      expect(configService.getOpenAIKey()).toBe('sk-proj-test123456')
    })

    it('setOpenAIKey with empty string should remove key', () => {
      configService.setOpenAIKey('sk-proj-test123456')
      configService.setOpenAIKey('')
      expect(configService.getOpenAIKey()).toBeNull()
    })
  })

  describe('Replicate key', () => {
    it('should return null when no key is set', () => {
      expect(configService.getReplicateKey()).toBeNull()
    })

    it('should store and retrieve a Replicate key', () => {
      configService.setReplicateKey('r8_abcdefghijklmnop')
      expect(configService.getReplicateKey()).toBe('r8_abcdefghijklmnop')
    })

    it('setReplicateKey with empty string should remove key', () => {
      configService.setReplicateKey('r8_abcdefghijklmnop')
      configService.setReplicateKey('')
      expect(configService.getReplicateKey()).toBeNull()
    })
  })

  describe('getBestEngine', () => {
    it('should return null when no keys are set', () => {
      expect(configService.getBestEngine()).toBeNull()
    })

    it('should return dalle3 when only OpenAI key is set', () => {
      configService.setOpenAIKey('sk-proj-abcdefghijklmnop')
      expect(configService.getBestEngine()).toBe('dalle3')
    })

    it('should return flux_pro when Replicate key is set', () => {
      configService.setReplicateKey('r8_abcdefghijklmnop')
      expect(configService.getBestEngine()).toBe('flux_pro')
    })

    it('should return flux_pro when both keys are set (Replicate is primary)', () => {
      configService.setOpenAIKey('sk-proj-abcdefghijklmnop')
      configService.setReplicateKey('r8_abcdefghijklmnop')
      expect(configService.getBestEngine()).toBe('flux_pro')
    })

    it('should return null for short keys', () => {
      configService.setOpenAIKey('short')
      expect(configService.getBestEngine()).toBeNull()
    })
  })

  describe('hasImageEngine', () => {
    it('should return false when no keys', () => {
      expect(configService.hasImageEngine()).toBe(false)
    })

    it('should return true with OpenAI key only', () => {
      configService.setOpenAIKey('sk-proj-abcdefghijklmnop')
      expect(configService.hasImageEngine()).toBe(true)
    })

    it('should return true with Replicate key only', () => {
      configService.setReplicateKey('r8_abcdefghijklmnop')
      expect(configService.hasImageEngine()).toBe(true)
    })
  })

  describe('clearAll', () => {
    it('should remove both keys', () => {
      configService.setOpenAIKey('sk-proj-test123456')
      configService.setReplicateKey('r8_abcdefghijklmnop')
      configService.clearAll()
      expect(configService.getOpenAIKey()).toBeNull()
      expect(configService.getReplicateKey()).toBeNull()
      expect(configService.hasImageEngine()).toBe(false)
    })
  })
})
