/**
 * Shared URL builder for iframe-embedded pages.
 * Used by PurchaseSubscriptionView and CustomPageView to build consistent URLs
 * with user_id, token, theme, lang, ui_mode, src_host, and src parameters.
 */

const EMBEDDED_USER_ID_QUERY_KEY = 'user_id'
const EMBEDDED_AUTH_TOKEN_QUERY_KEY = 'token'
const EMBEDDED_THEME_QUERY_KEY = 'theme'
const EMBEDDED_LANG_QUERY_KEY = 'lang'
const EMBEDDED_UI_MODE_QUERY_KEY = 'ui_mode'
const EMBEDDED_UI_MODE_VALUE = 'embedded'
const EMBEDDED_SRC_HOST_QUERY_KEY = 'src_host'
const EMBEDDED_SRC_QUERY_KEY = 'src_url'

export function buildEmbeddedUrl(
  baseUrl: string,
  userId?: number,
  authToken?: string | null,
  theme: 'light' | 'dark' = 'light',
  lang?: string,
): string {
  if (!baseUrl) return baseUrl
  try {
    const url = new URL(baseUrl)
    if (userId) {
      url.searchParams.set(EMBEDDED_USER_ID_QUERY_KEY, String(userId))
    }
    if (authToken) {
      url.searchParams.set(EMBEDDED_AUTH_TOKEN_QUERY_KEY, authToken)
    }
    url.searchParams.set(EMBEDDED_THEME_QUERY_KEY, theme)
    if (lang) {
      url.searchParams.set(EMBEDDED_LANG_QUERY_KEY, lang)
    }
    url.searchParams.set(EMBEDDED_UI_MODE_QUERY_KEY, EMBEDDED_UI_MODE_VALUE)
    // Source tracking: let the embedded page know where it's being loaded from
    if (typeof window !== 'undefined') {
      url.searchParams.set(EMBEDDED_SRC_HOST_QUERY_KEY, window.location.origin)
      url.searchParams.set(EMBEDDED_SRC_QUERY_KEY, window.location.href)
    }
    return url.toString()
  } catch {
    return baseUrl
  }
}

export interface ImagePlaygroundEmbedParams {
  playgroundUrl: string
  apiKey: string
  model: string
  apiMode?: string
  userId?: number
  authToken?: string | null
  theme?: 'light' | 'dark'
  lang?: string
}

/** Build GPT Image Playground iframe URL with Sub2API embed params and API key. */
export function buildImagePlaygroundUrl(params: ImagePlaygroundEmbedParams): string {
  const embeddedBase = buildEmbeddedUrl(
    params.playgroundUrl,
    params.userId,
    params.authToken,
    params.theme ?? 'light',
    params.lang,
  )
  if (!embeddedBase) return embeddedBase
  try {
    const url = new URL(embeddedBase)
    url.searchParams.set('apiKey', params.apiKey)
    url.searchParams.set('model', params.model)
    url.searchParams.set('apiMode', params.apiMode ?? 'images')
    // SSE 流式生图：长耗时请求持续输出 partial 事件，避免代理/网关空闲断连
    if (!url.searchParams.has('streamImages')) {
      url.searchParams.set('streamImages', 'true')
    }
    if (!url.searchParams.has('streamPartialImages') && url.searchParams.get('streamImages') !== 'false') {
      url.searchParams.set('streamPartialImages', '1')
    }
    return url.toString()
  } catch {
    return embeddedBase
  }
}

/** Build Infinite Canvas iframe URL with Sub2API embed params and API key. */
export function buildInfiniteCanvasUrl(params: {
  canvasUrl: string
  apiKey: string
  apiBaseUrl: string
  userId?: number
  authToken?: string | null
  theme?: 'light' | 'dark'
  lang?: string
}): string {
  const embeddedBase = buildEmbeddedUrl(
    params.canvasUrl,
    params.userId,
    params.authToken,
    params.theme ?? 'light',
    params.lang,
  )
  if (!embeddedBase) return embeddedBase
  try {
    const url = new URL(embeddedBase)
    url.searchParams.set('apiKey', params.apiKey)
    url.searchParams.set('baseUrl', params.apiBaseUrl)
    return url.toString()
  } catch {
    return embeddedBase
  }
}

export function detectTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}
