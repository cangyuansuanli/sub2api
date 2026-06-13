const CDN_BASE = (import.meta.env.VITE_STATIC_CDN || '').replace(/\/$/, '')

function encodePath(path: string): string {
  return path
    .replace(/^\//, '')
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

/** Public static asset URL via R2 CDN (VITE_STATIC_CDN). */
export function staticUrl(path: string): string {
  const encoded = encodePath(path)
  if (!CDN_BASE) {
    if (import.meta.env.DEV) {
      console.warn('[staticCdn] VITE_STATIC_CDN is not set; asset URLs may be broken.')
    }
    return `/${encoded}`
  }
  return `${CDN_BASE}/${encoded}`
}

export function hasStaticCdn(): boolean {
  return CDN_BASE.length > 0
}

/** Default site logo when admin site_logo is unset. */
export const DEFAULT_LOGO_URL = staticUrl('site/logo.png')
