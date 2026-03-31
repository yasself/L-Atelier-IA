/**
 * Tests for configService — single OpenAI key
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

  it('should return null when no key is set', () => {
    expect(configService.getOpenAIKey()).toBeNull()
  })

  it('should store and retrieve a key', () => {
    configService.setOpenAIKey('sk-proj-test123456')
    expect(configService.getOpenAIKey()).toBe('sk-proj-test123456')
  })

  it('hasValidConfig should return false when no key', () => {
    expect(configService.hasValidConfig()).toBe(false)
  })

  it('hasValidConfig should return false for short key', () => {
    configService.setOpenAIKey('short')
    expect(configService.hasValidConfig()).toBe(false)
  })

  it('hasValidConfig should return true for valid key', () => {
    configService.setOpenAIKey('sk-proj-abcdefghijklmnop')
    expect(configService.hasValidConfig()).toBe(true)
  })

  it('clearAll should remove the key', () => {
    configService.setOpenAIKey('sk-proj-test123456')
    expect(configService.hasValidConfig()).toBe(true)
    configService.clearAll()
    expect(configService.getOpenAIKey()).toBeNull()
    expect(configService.hasValidConfig()).toBe(false)
  })

  it('setOpenAIKey with empty string should remove key', () => {
    configService.setOpenAIKey('sk-proj-test123456')
    configService.setOpenAIKey('')
    expect(configService.getOpenAIKey()).toBeNull()
  })

  it('setOpenAIKey with null should remove key', () => {
    configService.setOpenAIKey('sk-proj-test123456')
    configService.setOpenAIKey(null)
    expect(configService.getOpenAIKey()).toBeNull()
  })
})
