(() => {
  'use strict';

  const siteOrigin = window.location.origin;
  const defaultSiteName = 'Sub2API';

  function applySitePlaceholders() {
    document.querySelectorAll('[data-site-origin]').forEach((el) => {
      el.textContent = siteOrigin;
    });
    document.querySelectorAll('[data-site-year]').forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
    document.querySelectorAll('[data-site-name]').forEach((el) => {
      if (el.textContent.trim() === '__SITE_NAME__') {
        el.textContent = defaultSiteName;
      }
    });
    document.querySelectorAll('[data-site-title]').forEach((el) => {
      const name = document.querySelector('[data-site-name]')?.textContent?.trim() || defaultSiteName;
      el.textContent = `${name} — 不掺水的 AI API 中转站`;
    });
    document.querySelectorAll('[data-copy-target="site-origin"]').forEach((btn) => {
      btn.dataset.copy = siteOrigin;
    });
  }

  async function loadPublicBranding() {
    try {
      const response = await fetch('/api/v1/settings/public', { signal: AbortSignal.timeout(2500) });
      if (!response.ok) return;
      const payload = await response.json();
      const settings = payload?.data;
      if (!settings || typeof settings !== 'object') return;

      const siteName = String(settings.site_name || '').trim();
      if (siteName) {
        document.querySelectorAll('[data-site-name]').forEach((el) => {
          el.textContent = siteName;
        });
        document.querySelectorAll('[data-site-title]').forEach((el) => {
          el.textContent = `${siteName} — 不掺水的 AI API 中转站`;
        });
      }

      const siteLogo = String(settings.site_logo || '').trim();
      if (siteLogo) {
        document.querySelectorAll('[data-site-logo]').forEach((img) => {
          img.src = siteLogo;
        });
      }
    } catch {
      /* noop */
    }
  }

  applySitePlaceholders();
  void loadPublicBranding();

  /* ════════════════════════════════════
     1. Silk / Woven Grid Background
     ════════════════════════════════════ */
  const silkCanvas = document.getElementById('silkCanvas');
  const silkCtx = silkCanvas.getContext('2d');
  let silkW, silkH;
  const mouse = { x: -9999, y: -9999, radius: 200 };
  let silkTime = 0;

  function resizeSilk() {
    silkW = silkCanvas.width = window.innerWidth;
    silkH = silkCanvas.height = window.innerHeight;
  }

  function drawSilk() {
    silkCtx.clearRect(0, 0, silkW, silkH);
    const spacing = 28;
    const cols = Math.ceil(silkW / spacing) + 2;
    const rows = Math.ceil(silkH / spacing) + 2;

    silkCtx.strokeStyle = 'rgba(12, 212, 168, 0.08)';
    silkCtx.lineWidth = 0.5;

    for (let i = 0; i < rows; i++) {
      silkCtx.beginPath();
      for (let j = 0; j <= cols; j++) {
        let x = j * spacing;
        let y = i * spacing;

        const wave = Math.sin(x * 0.008 + silkTime * 0.6) * 4
                   + Math.sin(y * 0.006 + silkTime * 0.4) * 3;
        y += wave;

        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 18;
          x += (dx / dist) * force;
          y += (dy / dist) * force;
        }

        if (j === 0) silkCtx.moveTo(x, y);
        else silkCtx.lineTo(x, y);
      }
      silkCtx.stroke();
    }

    for (let j = 0; j < cols; j++) {
      silkCtx.beginPath();
      for (let i = 0; i <= rows; i++) {
        let x = j * spacing;
        let y = i * spacing;

        const wave = Math.cos(y * 0.007 + silkTime * 0.5) * 4
                   + Math.cos(x * 0.009 + silkTime * 0.3) * 3;
        x += wave;

        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 18;
          x += (dx / dist) * force;
          y += (dy / dist) * force;
        }

        if (i === 0) silkCtx.moveTo(x, y);
        else silkCtx.lineTo(x, y);
      }
      silkCtx.stroke();
    }

    silkTime += 0.012;
  }


  /* ════════════════════════════════════
     2. Floating Particles
     ════════════════════════════════════ */
  const particleCanvas = document.getElementById('particleCanvas');
  const pCtx = particleCanvas.getContext('2d');
  let pW, pH;
  const particles = [];
  const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 18000));

  function resizeParticles() {
    pW = particleCanvas.width = window.innerWidth;
    pH = particleCanvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * (pW || window.innerWidth);
      this.y = Math.random() * (pH || window.innerHeight);
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (1 - dist / 120) * 0.8;
        this.x += dx / dist * force;
        this.y += dy / dist * force;
      }

      if (this.x < -10 || this.x > pW + 10 || this.y < -10 || this.y > pH + 10) {
        this.reset();
      }
    }
    draw() {
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(12, 212, 168, ${this.opacity})`;
      pCtx.fill();
    }
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function drawParticles() {
    pCtx.clearRect(0, 0, pW, pH);
    for (const p of particles) { p.update(); p.draw(); }

    pCtx.strokeStyle = 'rgba(12, 212, 168, 0.05)';
    pCtx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          pCtx.globalAlpha = 1 - dist / 160;
          pCtx.beginPath();
          pCtx.moveTo(particles[i].x, particles[i].y);
          pCtx.lineTo(particles[j].x, particles[j].y);
          pCtx.stroke();
        }
      }
    }
    pCtx.globalAlpha = 1;
  }


  /* ════════════════════════════════════
     3. Animation loop
     ════════════════════════════════════ */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate() {
    if (!prefersReduced) {
      drawSilk();
      drawParticles();
    }
    requestAnimationFrame(animate);
  }

  function init() {
    resizeSilk();
    resizeParticles();
    initParticles();
    animate();
  }

  window.addEventListener('resize', () => { resizeSilk(); resizeParticles(); });
  window.addEventListener('load', init);


  /* ════════════════════════════════════
     4. Cursor glow
     ════════════════════════════════════ */
  const cursorGlow = document.getElementById('cursorGlow');

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (cursorGlow) {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });


  /* ════════════════════════════════════
     5. Spotlight cards
     ════════════════════════════════════ */
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    const spotlight = card.querySelector('.card-spotlight');
    if (!spotlight) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(12,212,168,0.08), transparent 60%)`;
    });
  });


  /* ════════════════════════════════════
     6. Scroll animations
     ════════════════════════════════════ */
  const animateEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  animateEls.forEach((el) => observer.observe(el));


  /* ════════════════════════════════════
     7. Count-up animation
     ════════════════════════════════════ */
  document.querySelectorAll('[data-countup]').forEach((el) => {
    const target = parseFloat(el.dataset.countup);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    let started = false;

    const countObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        const duration = 1800;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = (target * ease).toFixed(decimals);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObserver.disconnect();
      }
    }, { threshold: 0.5 });
    countObserver.observe(el);
  });


  /* ════════════════════════════════════
     8. Copy button
     ════════════════════════════════════ */
  document.querySelectorAll('.copy-btn, [data-copy]').forEach((btn) => {
    if (!btn.dataset.copy) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.classList.add('copied');
        const span = btn.querySelector('span');
        const old = span?.textContent;
        if (span) span.textContent = '已复制';
        setTimeout(() => {
          btn.classList.remove('copied');
          if (span && old) span.textContent = old;
        }, 1500);
      } catch { /* noop */ }
    });
  });


  /* ════════════════════════════════════
     9. Navbar scroll
     ════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      navbar.style.borderColor = 'rgba(255,255,255,0.1)';
      navbar.style.background = 'rgba(5,5,8,0.85)';
    } else {
      navbar.style.borderColor = '';
      navbar.style.background = '';
    }
    lastScroll = scrollY;
  }, { passive: true });


  /* ════════════════════════════════════
     10. Mobile menu
     ════════════════════════════════════ */
  const menuBtn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('mobileOverlay');

  function toggleMenu() { document.body.classList.toggle('menu-open'); }
  function closeMenu() { document.body.classList.remove('menu-open'); }

  menuBtn?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
})();
