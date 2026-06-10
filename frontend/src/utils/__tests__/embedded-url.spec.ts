import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildEmbeddedUrl, buildImagePlaygroundUrl, detectTheme } from '../embedded-url'

describe('embedded-url', () => {
  const originalLocation = window.location

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://app.example.com',
        href: 'https://app.example.com/user/purchase',
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    })
    document.documentElement.classList.remove('dark')
    vi.restoreAllMocks()
  })

  it('adds embedded query parameters including locale and source context', () => {
    const result = buildEmbeddedUrl(
      'https://pay.example.com/checkout?plan=pro',
      42,
      'token-123',
      'dark',
      'zh-CN',
    )

    const url = new URL(result)
    expect(url.searchParams.get('plan')).toBe('pro')
    expect(url.searchParams.get('user_id')).toBe('42')
    expect(url.searchParams.get('token')).toBe('token-123')
    expect(url.searchParams.get('theme')).toBe('dark')
    expect(url.searchParams.get('lang')).toBe('zh-CN')
    expect(url.searchParams.get('ui_mode')).toBe('embedded')
    expect(url.searchParams.get('src_host')).toBe('https://app.example.com')
    expect(url.searchParams.get('src_url')).toBe('https://app.example.com/user/purchase')
  })

  it('omits optional params when they are empty', () => {
    const result = buildEmbeddedUrl('https://pay.example.com/checkout', undefined, '', 'light')

    const url = new URL(result)
    expect(url.searchParams.get('theme')).toBe('light')
    expect(url.searchParams.get('ui_mode')).toBe('embedded')
    expect(url.searchParams.has('user_id')).toBe(false)
    expect(url.searchParams.has('token')).toBe(false)
    expect(url.searchParams.has('lang')).toBe(false)
  })

  it('returns original string for invalid url input', () => {
    expect(buildEmbeddedUrl('not a url', 1, 'token')).toBe('not a url')
  })

  it('adds playground api params on top of embedded params', () => {
    const result = buildImagePlaygroundUrl({
      playgroundUrl: 'https://image.example.com',
      apiKey: 'sk-test',
      model: 'gpt-image-2',
      apiMode: 'images',
      userId: 7,
      authToken: 'jwt-token',
      theme: 'light',
      lang: 'zh',
    })

    const url = new URL(result)
    expect(url.searchParams.get('apiKey')).toBe('sk-test')
    expect(url.searchParams.get('model')).toBe('gpt-image-2')
    expect(url.searchParams.get('apiMode')).toBe('images')
    expect(url.searchParams.get('streamImages')).toBe('true')
    expect(url.searchParams.get('streamPartialImages')).toBe('1')
    expect(url.searchParams.get('user_id')).toBe('7')
    expect(url.searchParams.get('token')).toBe('jwt-token')
    expect(url.searchParams.get('ui_mode')).toBe('embedded')
  })

  it('detects dark mode from document root class', () => {
    document.documentElement.classList.add('dark')
    expect(detectTheme()).toBe('dark')
  })
})
