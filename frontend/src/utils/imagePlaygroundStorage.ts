const STORAGE_KEY_PREFIX = 'image_playground_api_key'

export function getImagePlaygroundApiKeyStorageKey(userId?: number): string {
  return userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX
}

export function getSavedImagePlaygroundApiKey(userId?: number): string | null {
  try {
    const value = localStorage.getItem(getImagePlaygroundApiKeyStorageKey(userId))
    const trimmed = value?.trim()
    return trimmed || null
  } catch {
    return null
  }
}

export function saveImagePlaygroundApiKey(userId: number | undefined, apiKey: string): void {
  localStorage.setItem(getImagePlaygroundApiKeyStorageKey(userId), apiKey.trim())
}

export function clearImagePlaygroundApiKey(userId?: number): void {
  localStorage.removeItem(getImagePlaygroundApiKeyStorageKey(userId))
}
