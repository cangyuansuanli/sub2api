import type { PublicSettings } from '@/types'

export function initMarketingHomePage(
  root: HTMLElement,
  options?: { publicSettings?: PublicSettings }
): void

export function destroyMarketingHomePage(root?: HTMLElement): void

declare global {
  interface HTMLElement {
    _mhCleanup?: () => void
  }
}

export {}
