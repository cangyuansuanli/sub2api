import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearImagePlaygroundApiKey,
  getImagePlaygroundApiKeyStorageKey,
  getSavedImagePlaygroundApiKey,
  saveImagePlaygroundApiKey,
} from '../imagePlaygroundStorage'

describe('imagePlaygroundStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and reads api key per user', () => {
    saveImagePlaygroundApiKey(42, 'sk-user-42')
    saveImagePlaygroundApiKey(7, 'sk-user-7')

    expect(getSavedImagePlaygroundApiKey(42)).toBe('sk-user-42')
    expect(getSavedImagePlaygroundApiKey(7)).toBe('sk-user-7')
    expect(getSavedImagePlaygroundApiKey(99)).toBeNull()
  })

  it('clears saved api key', () => {
    saveImagePlaygroundApiKey(1, 'sk-test')
    clearImagePlaygroundApiKey(1)
    expect(getSavedImagePlaygroundApiKey(1)).toBeNull()
  })

  it('builds scoped storage keys', () => {
    expect(getImagePlaygroundApiKeyStorageKey(5)).toBe('image_playground_api_key_5')
    expect(getImagePlaygroundApiKeyStorageKey()).toBe('image_playground_api_key')
  })
})
