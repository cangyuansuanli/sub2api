const STORAGE_KEY_PREFIX = 'infinite_canvas_api_key'

export function getInfiniteCanvasApiKeyStorageKey(userId?: number): string {
  if (userId) return `${STORAGE_KEY_PREFIX}_${userId}`
  return STORAGE_KEY_PREFIX
}

export function getSavedInfiniteCanvasApiKey(userId?: number): string {
  if (typeof localStorage === 'undefined') return ''
  return localStorage.getItem(getInfiniteCanvasApiKeyStorageKey(userId)) || ''
}

export function saveInfiniteCanvasApiKey(userId: number | undefined, apiKey: string): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(getInfiniteCanvasApiKeyStorageKey(userId), apiKey)
}
