/**
 * Marketing home page runtime (from stash WIP public/home/script.js).
 * @param {HTMLElement} root
 * @param {{ publicSettings?: Record<string, unknown> }} [options]
 */
export function initMarketingHomePage(root, options = {}) {
  if (root.dataset.mhInit === '1') return
  root.dataset.mhInit = '1'

  const cleanup = runMarketingHomeScript(root, options)
  root._mhCleanup = cleanup
}

/** @param {HTMLElement} [root] */
export function destroyMarketingHomePage(root) {
  const el = root || document.querySelector('.marketinghomeview-page')
  if (!el || !el._mhCleanup) return
  el._mhCleanup()
  delete el._mhCleanup
  delete el.dataset.mhInit
}

/**
 * @param {HTMLElement} root
 * @param {{ publicSettings?: Record<string, unknown> }} options
 */
function runMarketingHomeScript(root, options) {
  'use strict'

  const defaultSiteName = 'Sub2API'
  const DEFAULT_PUBLIC_DOMAIN = 'cangyuansuanli.cn'
  const API_DOMAIN = 'api.cangyuansuanli.cn'
  const IMAGE_DOMAIN = 'image.cangyuansuanli.cn'
  const BOOT_MIN_VISIBLE_MS = 550
  const BOOT_MAX_WAIT_MS = 2400

  let displayDomain = DEFAULT_PUBLIC_DOMAIN
  let displayOriginV1 = `https://${API_DOMAIN}/v1`
  const displayImageOrigin = `https://${IMAGE_DOMAIN}`

  function createSpeedTargets() {
    return [
      {
        label: '主站 API',
        host: API_DOMAIN,
        url: `https://${API_DOMAIN}/v1/models`,
      },
      {
        label: '模型广场',
        host: IMAGE_DOMAIN,
        url: `https://${IMAGE_DOMAIN}/`,
      },
    ]
  }

  let speedTargets = createSpeedTargets()

  function isLocalHost(hostname) {
    if (!hostname) return true
    if (hostname === 'localhost' || hostname.endsWith('.local')) return true
    if (hostname === '::1' || /^127\./.test(hostname)) return true
    if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname)) return true
    return false
  }

  function hostnameFromUrl(value) {
    if (!value) return ''
    try {
      return new URL(value).hostname
    } catch {
      return ''
    }
  }

  function resolveDisplayDomain(settings) {
    const docHost = hostnameFromUrl(String(settings?.doc_url || '').trim())
    if (docHost && !isLocalHost(docHost)) return docHost

    const currentHost = window.location.hostname
    if (currentHost && !isLocalHost(currentHost)) return currentHost

    return DEFAULT_PUBLIC_DOMAIN
  }

  function updateDisplayDomain(settings) {
    displayDomain = resolveDisplayDomain(settings)
    displayOriginV1 = `https://${API_DOMAIN}/v1`
  }

  updateDisplayDomain()

  function refreshSpeedTargetHosts() {
    speedTargets = createSpeedTargets()
  }

  function applySitePlaceholders() {
    root.querySelectorAll('[data-site-domain]').forEach((el) => {
      el.textContent = displayDomain
    })
    root.querySelectorAll('[data-site-origin-v1]').forEach((el) => {
      el.textContent = displayOriginV1
    })
    root.querySelectorAll('[data-site-image-origin]').forEach((el) => {
      el.textContent = displayImageOrigin
    })
    root.querySelectorAll('[data-site-year]').forEach((el) => {
      el.textContent = String(new Date().getFullYear())
    })
    root.querySelectorAll('[data-site-name]').forEach((el) => {
      if (!el.textContent.trim() || el.textContent.trim() === '__SITE_NAME__') {
        el.textContent = defaultSiteName
      }
    })
    root.querySelectorAll('[data-copy-target="site-origin"]').forEach((btn) => {
      btn.dataset.copy = displayOriginV1
    })
    root.querySelectorAll('[data-copy-target="site-image"]').forEach((btn) => {
      btn.dataset.copy = displayImageOrigin
    })
    root.querySelectorAll('[data-boot-host="api"]').forEach((el) => {
      el.textContent = API_DOMAIN
    })
    root.querySelectorAll('[data-boot-host="image"]').forEach((el) => {
      el.textContent = IMAGE_DOMAIN
    })
  }

  async function loadPublicBranding(settingsFromOptions) {
    try {
      let settings = settingsFromOptions
      if (!settings) {
        const response = await fetch('/api/v1/settings/public', { signal: AbortSignal.timeout(2500) })
        if (!response.ok) return
        const payload = await response.json()
        settings = payload?.data
      }
      if (!settings || typeof settings !== 'object') return

      const siteName = String(settings.site_name || '').trim()
      if (siteName) {
        root.querySelectorAll('[data-site-name]').forEach((el) => {
          el.textContent = siteName
        })
      }

      const siteLogo = String(settings.site_logo || '').trim()
      if (siteLogo) {
        root.querySelectorAll('[data-site-logo]').forEach((img) => {
          img.src = siteLogo
          img.hidden = false
        })
        root.querySelectorAll('.brand-mark').forEach((mark) => {
          mark.style.display = 'none'
        })
      } else {
        root.querySelectorAll('[data-site-logo]').forEach((img) => {
          img.hidden = false
        })
      }

      updateDisplayDomain(settings)
      refreshSpeedTargetHosts()
      applySitePlaceholders()
    } catch {
      /* noop */
    }
  }

  applySitePlaceholders()
  void loadPublicBranding(options.publicSettings)

  const bootOverlay = root.querySelector('#bootOverlay')
  const bootSpeedGrid = root.querySelector('#bootSpeedGrid')
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const disposers = []

  function renderSpeedCards(cards) {
    if (!bootSpeedGrid) return
    bootSpeedGrid.innerHTML = cards
      .map((card) => {
        const value = card.ms != null ? `${card.ms} ms` : 'TESTING'
        return `<span class="boot-speed-card testing"><b>${card.label}</b><em>${value}</em><small>${card.host}</small></span>`
      })
      .join('')
  }

  function initBootSpeedTest() {
    if (!bootOverlay || prefersReduced) {
      document.body.classList.remove('boot-active')
      document.body.classList.add('boot-complete')
      bootOverlay?.remove()
      return
    }

    const bootStart = performance.now()
    let cards = speedTargets.map((target) => ({
      ...target,
      ms: null,
    }))
    renderSpeedCards(cards)

    let dismissed = false
    let pageReady = document.readyState !== 'loading'
    const samples = new Map(speedTargets.map((t) => [t.label, []]))
    const outcomes = new Map(speedTargets.map((t) => [t.label, false]))

    let probeTimer
    let displayTimer
    let exitTimer

    function markPageReady() {
      pageReady = true
      tryDismissBoot()
    }

    if (!pageReady) {
      document.addEventListener('DOMContentLoaded', markPageReady, { once: true })
    }

    function tryDismissBoot() {
      if (dismissed) return
      const elapsed = performance.now() - bootStart
      const allResolved = speedTargets.every((target) => outcomes.get(target.label))
      const canDismiss = pageReady && allResolved && elapsed >= BOOT_MIN_VISIBLE_MS
      const forceDismiss = elapsed >= BOOT_MAX_WAIT_MS
      if (!canDismiss && !forceDismiss) return

      dismissed = true
      window.clearInterval(probeTimer)
      window.clearInterval(displayTimer)
      window.clearInterval(exitTimer)
      bootOverlay.classList.add('is-hiding')
      window.setTimeout(() => {
        document.body.classList.remove('boot-active')
        document.body.classList.add('boot-complete')
        bootOverlay.remove()
      }, 680)
    }

    async function ping(target) {
      const started = performance.now()
      const controller = new AbortController()
      const timer = window.setTimeout(() => controller.abort(), 1200)
      const sep = target.url.includes('?') ? '&' : '?'
      try {
        await fetch(`${target.url}${sep}ping=${Date.now()}_${Math.random().toString(36).slice(2)}`, {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal,
        })
        return { ok: true, ms: Math.max(1, Math.round(performance.now() - started)) }
      } catch {
        return { ok: false, ms: null }
      } finally {
        window.clearTimeout(timer)
      }
    }

    async function probe(target) {
      if (dismissed) return
      const result = await ping(target)
      if (dismissed) return

      outcomes.set(target.label, true)
      if (result.ok) {
        const bucket = samples.get(target.label) || []
        bucket.push(result.ms)
        if (bucket.length > 6) bucket.shift()
        samples.set(target.label, bucket)
      }
      tryDismissBoot()
    }

    function tickDisplay() {
      if (dismissed) return
      cards = cards.map((card, index) => {
        const bucket = samples.get(card.label) || []
        if (bucket.length) {
          const avg = bucket.reduce((sum, ms) => sum + ms, 0) / bucket.length
          const wobble = Math.sin((Date.now() + index * 370) / 95) * 7 + (Math.random() - 0.5) * 5
          return { ...card, ms: Math.max(1, Math.round(avg + wobble)) }
        }
        const base = card.label.includes('API') ? 22 : 38
        const simulated = Math.max(
          6,
          Math.round(base + Math.random() * 110 + Math.sin((Date.now() + index * 360) / 120) * 22)
        )
        return { ...card, ms: simulated }
      })
      renderSpeedCards(cards)
    }

    const runAll = () => speedTargets.forEach((target) => void probe(target))
    runAll()
    probeTimer = window.setInterval(runAll, 420)
    displayTimer = window.setInterval(tickDisplay, 85)
    exitTimer = window.setInterval(tryDismissBoot, 60)

    disposers.push(() => {
      window.clearInterval(probeTimer)
      window.clearInterval(displayTimer)
      window.clearInterval(exitTimer)
    })
  }

  initBootSpeedTest()

  function gaussRandom() {
    let u = 0
    let v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }

  function rotatePoint(p, rotX, rotY) {
    const cosY = Math.cos(rotY)
    const sinY = Math.sin(rotY)
    let x = p.x * cosY + p.z * sinY
    let y = p.y
    let z = -p.x * sinY + p.z * cosY

    const cosX = Math.cos(rotX)
    const sinX = Math.sin(rotX)
    const y2 = y * cosX - z * sinX
    const z2 = y * sinX + z * cosX
    return { x, y: y2, z: z2 }
  }

  function initNebulaCanvas() {
    const canvas = root.querySelector('#nebulaCanvas')
    const hero = root.querySelector('#hero')
    if (!canvas || !hero || prefersReduced) return null

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const mouse = { tx: 0, ty: 0 }
    let width = 0
    let height = 0
    let centerX = 0
    let centerY = 0
    let rotY = 0
    const rotX = 0.18
    let particles = []
    let running = true
    let frameId = 0

    function particleCount() {
      const area = width * height
      return Math.min(2200, Math.max(1100, Math.floor(area / 420)))
    }

    function initParticles() {
      const count = particleCount()
      particles = []

      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: gaussRandom() * 0.58,
          y: gaussRandom() * 0.2,
          z: gaussRandom() * 0.42,
          size: 0.16 + Math.random() * 0.72,
          alpha: 0.34 + Math.random() * 0.46,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.5 + Math.random() * 1.6,
        })
      }
    }

    function resize() {
      const rect = hero.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      centerX = width * 0.5
      centerY = height * 0.46
      initParticles()
    }

    function drawNebula(time) {
      if (!running) return

      ctx.clearRect(0, 0, width, height)

      const baseScale = Math.min(width, height) * 0.3
      const spin = rotY + time * 0.00004 + mouse.tx * 0.06
      const tilt = rotX + mouse.ty * 0.04
      const projected = []

      for (const particle of particles) {
        const rotated = rotatePoint(particle, tilt, spin)
        const perspective = 4.2 / (4.2 + rotated.z)
        const sx = centerX + rotated.x * baseScale * perspective + mouse.tx * 10 * perspective
        const sy = centerY + rotated.y * baseScale * perspective + mouse.ty * 6 * perspective
        const depth = (rotated.z + 1.1) / 2.2
        const twinkle = 0.72 + 0.28 * Math.sin(time * 0.0009 * particle.twinkleSpeed + particle.twinkle)
        const alpha = particle.alpha * twinkle * (0.38 + depth * 0.72)
        const size = particle.size * perspective * (0.42 + depth * 0.55)

        projected.push({ sx, sy, size, alpha, z: rotated.z })
      }

      projected.sort((a, b) => a.z - b.z)

      for (const point of projected) {
        if (point.alpha < 0.03) continue
        const radius = Math.max(0.28, point.size)
        ctx.beginPath()
        ctx.arc(point.sx, point.sy, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(230, 248, 255, ${Math.min(0.92, point.alpha)})`
        ctx.fill()
      }

      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseScale * 1.15)
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
      glow.addColorStop(0.35, 'rgba(37, 232, 255, 0.16)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      rotY += 0.00008
    }

    function frame(time) {
      drawNebula(time)
      frameId = requestAnimationFrame(frame)
    }

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        running = entries.some((entry) => entry.isIntersecting)
      },
      { threshold: 0.05 }
    )
    visibilityObserver.observe(hero)

    const onHeroMove = (event) => {
      const rect = hero.getBoundingClientRect()
      mouse.tx = ((event.clientX - rect.left) / width - 0.5) * 2
      mouse.ty = ((event.clientY - rect.top) / height - 0.5) * 2
    }

    hero.addEventListener('mousemove', onHeroMove)
    window.addEventListener('resize', resize)
    resize()
    frameId = requestAnimationFrame(frame)

    return () => {
      running = false
      cancelAnimationFrame(frameId)
      visibilityObserver.disconnect()
      hero.removeEventListener('mousemove', onHeroMove)
      window.removeEventListener('resize', resize)
    }
  }

  function mountRisingSparkles() {
    const field = root.querySelector('#heroDataField')
    if (!field || prefersReduced) return

    const fragment = document.createDocumentFragment()
    Array.from({ length: 16 }, (_, index) => {
      const node = document.createElement('span')
      node.className = 'data-particle'
      node.style.left = `${(index * 17 + 8) % 100}%`
      node.style.top = `${(index * 23 + 12) % 100}%`
      node.style.setProperty('--delay', `${index * -260}ms`)
      node.style.setProperty('--duration', `${4200 + (index % 5) * 620}ms`)
      fragment.appendChild(node)
    })
    field.appendChild(fragment)
  }

  const nebulaCleanup = initNebulaCanvas()
  if (nebulaCleanup) disposers.push(nebulaCleanup)
  mountRisingSparkles()

  const animateEls = root.querySelectorAll('[data-animate]')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  animateEls.forEach((el) => observer.observe(el))
  disposers.push(() => observer.disconnect())

  const pageRail = root.querySelector('#pageRail')
  const sectionIds = ['hero', 'access', 'tools', 'inspiration', 'features', 'pricing']

  pageRail?.querySelectorAll('button[data-section]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.section
      const target = root.querySelector(`#${id}`)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    })
  })

  function updatePageRail() {
    if (!pageRail) return
    const marker = window.scrollY + window.innerHeight * 0.35
    let activeId = sectionIds[0]

    for (const id of sectionIds) {
      const el = root.querySelector(`#${id}`)
      if (el && el.offsetTop <= marker) activeId = id
    }

    pageRail.querySelectorAll('button[data-section]').forEach((btn) => {
      btn.setAttribute('aria-current', btn.dataset.section === activeId ? 'true' : 'false')
    })
  }

  const onScrollPageRail = () => updatePageRail()
  const onLoadPageRail = () => updatePageRail()
  window.addEventListener('scroll', onScrollPageRail, { passive: true })
  window.addEventListener('load', onLoadPageRail)
  updatePageRail()
  disposers.push(() => {
    window.removeEventListener('scroll', onScrollPageRail)
    window.removeEventListener('load', onLoadPageRail)
  })

  root.querySelectorAll('.copy-btn, [data-copy]').forEach((btn) => {
    if (!btn.dataset.copy) return
    const onCopy = async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy)
        btn.classList.add('copied')
        const small = btn.querySelector('small')
        const old = small?.textContent
        if (small) small.textContent = '已复制'
        setTimeout(() => {
          btn.classList.remove('copied')
          if (small && old) small.textContent = old
        }, 1500)
      } catch {
        /* noop */
      }
    }
    btn.addEventListener('click', onCopy)
    disposers.push(() => btn.removeEventListener('click', onCopy))
  })

  const navbar = root.querySelector('#navbar')
  const onScrollNav = () => {
    if (!navbar) return
    if (window.scrollY > 80) {
      navbar.style.background = 'rgba(5, 11, 18, 0.92)'
      navbar.style.borderColor = 'rgba(255, 255, 255, 0.12)'
    } else {
      navbar.style.background = ''
      navbar.style.borderColor = ''
    }
  }
  window.addEventListener('scroll', onScrollNav, { passive: true })
  disposers.push(() => window.removeEventListener('scroll', onScrollNav))

  const menuBtn = root.querySelector('#mobileMenuBtn')
  const overlay = root.querySelector('#mobileOverlay')

  function toggleMenu() {
    document.body.classList.toggle('menu-open')
  }
  function closeMenu() {
    document.body.classList.remove('menu-open')
  }

  menuBtn?.addEventListener('click', toggleMenu)
  overlay?.addEventListener('click', closeMenu)
  const navLinks = root.querySelectorAll('.home-nav a')
  navLinks.forEach((a) => a.addEventListener('click', closeMenu))
  const onKeydown = (e) => {
    if (e.key === 'Escape') closeMenu()
  }
  document.addEventListener('keydown', onKeydown)

  disposers.push(() => {
    menuBtn?.removeEventListener('click', toggleMenu)
    overlay?.removeEventListener('click', closeMenu)
    navLinks.forEach((a) => a.removeEventListener('click', closeMenu))
    document.removeEventListener('keydown', onKeydown)
  })

  return () => {
    disposers.forEach((fn) => fn())
  }
}
