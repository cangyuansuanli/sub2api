<template>
  <div ref="pageRoot" class="marketinghomeview-page">
    <div class="boot-overlay" id="bootOverlay" aria-hidden="true">
        <div class="boot-panel">
          <div class="boot-identity">
            <span class="brand-mark brand-mark--boot" aria-hidden="true"></span>
            <strong data-site-name>__SITE_NAME__</strong>
            <em>Node Speed Test</em>
          </div>
          <div class="boot-stack">
            <div class="boot-speed-intro">
              <strong>正在测试当前网络到节点的响应</strong>
              <span>Route latency</span>
            </div>
            <div class="boot-speed-grid" id="bootSpeedGrid"></div>
            <div class="boot-route">
              <span>Browser</span><i></i>
              <span data-boot-host="api">api.cangyuansuanli.cn</span><i></i>
              <span data-boot-host="image">image.cangyuansuanli.cn</span>
            </div>
            <div class="boot-progress"><span></span></div>
          </div>
        </div>
      </div>

      <div class="home-shell">
        <header class="home-topbar" id="navbar">
          <a class="home-brand" href="/">
            <span class="brand-mark" aria-hidden="true"></span>
            <img :src="`${CDN}/site/logo.png`" alt="" width="32" height="32" data-site-logo hidden>
            <span data-site-name>__SITE_NAME__</span>
          </a>
          <nav class="home-nav" id="navLinks" aria-label="主导航">
            <a href="#access">API 接入</a>
            <a href="#tools">工具入口</a>
            <a href="#inspiration">灵感广场</a>
            <a href="#features">核心优势</a>
            <a href="/image-playground">生图工作站</a>
            <a href="/docs/models">模型广场</a>
            <a href="/docs">文档</a>
          </nav>
          <div class="home-actions" id="navActions">
            <a class="btn btn-ghost login-action" href="/login">登录</a>
            <a class="btn btn-primary console-action" href="/register">
              控制台
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
          <button class="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="打开菜单">
            <span></span><span></span><span></span>
          </button>
        </header>

        <main>
          <section class="hero" id="hero">
            <canvas id="nebulaCanvas" class="nebula-canvas" aria-hidden="true"></canvas>
            <div class="hero-data-field" id="heroDataField" aria-hidden="true"></div>
            <div class="hero-copy">
              <span class="hero-kicker">MULTI MODEL API GATEWAY</span>
              <h1 data-site-name>__SITE_NAME__</h1>
              <span class="hero-domain" data-site-domain>cangyuansuanli.cn</span>
              <p class="hero-subtitle">
                多模型聚合 / OpenAI 兼容 / 稳定调度<br>
                一个 Base URL 统一接入 GPT、Claude 等主流模型
              </p>
              <div class="hero-actions">
                <a class="btn btn-primary btn-lg primary-action" href="/docs">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  查看接入文档
                </a>
                <a class="btn btn-outline btn-lg secondary-action" href="/register">
                  进入控制台
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
              </div>
            </div>
            <div class="hero-scroll-cue" aria-hidden="true">
              <span>SCROLL TO DISCOVER</span>
            </div>
          </section>

          <section class="access-section section" id="access">
            <div class="container">
              <div class="section-head" data-animate>
                <span class="section-kicker">Models</span>
                <h2>API 接入</h2>
                <p>OpenAI 兼容接口，复制 Base URL 即可接入</p>
              </div>
              <div class="endpoint-strip" data-animate>
                <button class="endpoint-button copy-btn" type="button" data-copy-target="site-image">
                  <span>模型广场</span>
                  <code data-site-image-origin>https://image.cangyuansuanli.cn</code>
                  <small>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    复制
                  </small>
                </button>
                <button class="endpoint-button copy-btn" type="button" data-copy-target="site-origin">
                  <span>API 接入</span>
                  <code data-site-origin-v1>https://api.cangyuansuanli.cn/v1</code>
                  <small>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    复制
                  </small>
                </button>
                <a class="endpoint-button" href="/docs">
                  <span>文档入口</span>
                  <code>/docs</code>
                  <small>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    打开
                  </small>
                </a>
              </div>
              <div class="model-icon-grid" data-animate>
                <div class="model-icon-card"><span class="model-logo model-logo--openai"><img :src="`${CDN}/home/models/openai.svg`" alt="OpenAI" width="32" height="32" loading="lazy"></span><strong>OpenAI</strong><em>GPT</em></div>
                <div class="model-icon-card"><span class="model-logo model-logo--claude"><img :src="`${CDN}/home/models/claude.svg`" alt="Claude" width="32" height="32" loading="lazy"></span><strong>Claude</strong><em>Anthropic</em></div>
                <div class="model-icon-card"><span class="model-logo model-logo--gemini"><img :src="`${CDN}/home/models/gemini.png`" alt="Gemini" width="48" height="24" loading="lazy"></span><strong>Gemini</strong><em>Google</em></div>
                <div class="model-icon-card"><span class="model-logo model-logo--deepseek"><img :src="`${CDN}/home/models/deepseek.svg`" alt="DeepSeek" width="32" height="32" loading="lazy"></span><strong>DeepSeek</strong><em>DeepSeek</em></div>
                <div class="model-icon-card"><span class="model-logo model-logo--qwen"><img :src="`${CDN}/home/models/qwen.svg`" alt="Qwen" width="32" height="32" loading="lazy"></span><strong>Qwen</strong><em>通义千问</em></div>
                <div class="model-icon-card"><span class="model-logo model-logo--grok"><img :src="`${CDN}/home/models/grok.svg`" alt="Grok" width="32" height="32" loading="lazy"></span><strong>Grok</strong><em>xAI</em></div>
              </div>
            </div>
          </section>

          <section class="tools-section section section-alt" id="tools">
            <div class="container">
              <div class="section-head" data-animate>
                <span class="section-kicker">API 接入</span>
                <h2>工具入口</h2>
                <p>兼容 OpenAI API 格式，一个 Base URL 接入所有工具</p>
              </div>
              <div class="tool-grid" data-animate>
                <a class="tool-card" href="/docs#claude-code">
                  <img :src="`${CDN}/home/tools/claude-code.png`" alt="Claude Code" loading="lazy">
                  <div class="tool-overlay"></div>
                  <div class="tool-content">
                    <span class="tool-label">Claude Code</span>
                    <h3>Claude Code</h3>
                    <p>Anthropic</p>
                  </div>
                </a>
                <a class="tool-card" href="/docs#codex-cli">
                  <img :src="`${CDN}/home/tools/codex-cli.png`" alt="Codex CLI" loading="lazy">
                  <div class="tool-overlay"></div>
                  <div class="tool-content">
                    <span class="tool-label">Codex</span>
                    <h3>Codex CLI</h3>
                    <p>OpenAI /v1</p>
                  </div>
                </a>
                <a class="tool-card" href="/docs#gemini-cli">
                  <img :src="`${CDN}/home/tools/gemini-cli.png`" alt="Gemini CLI" loading="lazy">
                  <div class="tool-overlay"></div>
                  <div class="tool-content">
                    <span class="tool-label">Gemini CLI</span>
                    <h3>Gemini CLI</h3>
                    <p>Google</p>
                  </div>
                </a>
                <article class="tool-card tool-card--dual">
                  <img :src="`${CDN}/home/tools/image-api.png`" alt="图像模型" loading="lazy">
                  <div class="tool-overlay"></div>
                  <div class="tool-content">
                    <span class="tool-label">Image API</span>
                    <h3>图像模型</h3>
                    <p>API 接入与生图工作站</p>
                    <div class="tool-card-actions">
                      <a class="tool-card-btn" href="/docs#image-api">接入文档</a>
                      <a class="tool-card-btn tool-card-btn--primary" href="/image-playground">打开工作站</a>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section class="inspiration-section section section-alt" id="inspiration">
            <div class="container">
              <div class="section-head section-head--row" data-animate>
                <div>
                  <span class="section-kicker">Inspiration</span>
                  <h2>灵感广场</h2>
                </div>
                <a class="btn btn-outline inspiration-cta" href="/image-playground">
                  用同款生成
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
              </div>
              <div class="inspiration-grid" data-animate>
                <a class="inspiration-card" href="/image-playground">
                  <img :src="`${CDN}/home/inspiration/01-city-poster.jpg`" alt="城市文字旅行海报" loading="lazy">
                  <div class="inspiration-meta">
                    <span>01</span>
                    <strong>城市文字旅行海报</strong>
                    <p>海报 / 城市 / 排版</p>
                  </div>
                </a>
                <a class="inspiration-card" href="/image-playground">
                  <img :src="`${CDN}/home/inspiration/02-portrait.jpg`" alt="便利店写真人像" loading="lazy">
                  <div class="inspiration-meta">
                    <span>02</span>
                    <strong>便利店写真人像</strong>
                    <p>写真 / 人物 / 氛围</p>
                  </div>
                </a>
                <a class="inspiration-card" href="/image-playground">
                  <img :src="`${CDN}/home/inspiration/03-product-blueprint.jpg`" alt="产品结构蓝图" loading="lazy">
                  <div class="inspiration-meta">
                    <span>03</span>
                    <strong>产品结构蓝图</strong>
                    <p>产品 / 科技 / 蓝图</p>
                  </div>
                </a>
                <a class="inspiration-card" href="/image-playground">
                  <img :src="`${CDN}/home/inspiration/04-campaign-kv.jpg`" alt="视觉活动主 KV" loading="lazy">
                  <div class="inspiration-meta">
                    <span>04</span>
                    <strong>视觉活动主 KV</strong>
                    <p>商业 / 创意 / 风格</p>
                  </div>
                </a>
                <a class="inspiration-card" href="/image-playground">
                  <img :src="`${CDN}/home/inspiration/05-architecture.jpg`" alt="空间结构概念图" loading="lazy">
                  <div class="inspiration-meta">
                    <span>05</span>
                    <strong>空间结构概念图</strong>
                    <p>建筑 / 空间 / 概念</p>
                  </div>
                </a>
                <a class="inspiration-card" href="/image-playground">
                  <img :src="`${CDN}/home/inspiration/06-document-cover.jpg`" alt="文档封面设计" loading="lazy">
                  <div class="inspiration-meta">
                    <span>06</span>
                    <strong>文档封面设计</strong>
                    <p>封面 / 文档 / 质感</p>
                  </div>
                </a>
                <a class="inspiration-card" href="/image-playground">
                  <img :src="`${CDN}/home/inspiration/07-gallery-wall.jpg`" alt="作品集展示墙" loading="lazy">
                  <div class="inspiration-meta">
                    <span>07</span>
                    <strong>作品集展示墙</strong>
                    <p>合集 / 灵感 / 展示</p>
                  </div>
                </a>
                <a class="inspiration-card" href="/image-playground">
                  <img :src="`${CDN}/home/inspiration/08-ui-experiment.jpg`" alt="界面视觉实验" loading="lazy">
                  <div class="inspiration-meta">
                    <span>08</span>
                    <strong>界面视觉实验</strong>
                    <p>界面 / 科技 / 交互</p>
                  </div>
                </a>
              </div>
            </div>
          </section>

          <section class="features-section section" id="features">
            <div class="container">
              <div class="section-head" data-animate>
                <span class="section-kicker">Core Advantages</span>
                <h2>为什么选择 <span data-site-name>__SITE_NAME__</span></h2>
                <p>不靠玄学承诺，靠数据说话。每一项都可查、可验证。</p>
              </div>
              <div class="features-grid" data-animate>
                <article class="glass-card">
                  <div class="card-icon card-icon--cyan">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <h3>保真不掺水</h3>
                  <p>自有官方订阅号池，支持第三方工具独立质检，真假一测便知。</p>
                </article>
                <article class="glass-card">
                  <div class="card-icon card-icon--blue">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  </div>
                  <h3>稳定调度</h3>
                  <p>多账号、多通道冗余负载，智能分流，降低限流对业务的影响。</p>
                </article>
                <article class="glass-card">
                  <div class="card-icon card-icon--green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </div>
                  <h3>高效接入</h3>
                  <p>一个 Base URL 和 API Key，Codex、Claude Code、Cursor 快速复用配置。</p>
                </article>
                <article class="glass-card">
                  <div class="card-icon card-icon--purple">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  <h3>成本透明</h3>
                  <p>模型价格、调用记录和余额变化都能在后台查看，每一笔消耗一目了然。</p>
                </article>
                <article class="glass-card">
                  <div class="card-icon card-icon--orange">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/></svg>
                  </div>
                  <h3>无条件退款</h3>
                  <p>退款 = 充值 − 消耗。没有霸王条款，随时可走。</p>
                </article>
                <article class="glass-card">
                  <div class="card-icon card-icon--cyan">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <h3>隐私安全</h3>
                  <p>绝不存储、分析、倒卖任何对话数据。你的代码和对话只属于你自己。</p>
                </article>
              </div>
            </div>
          </section>

          <section class="steps-section section section-alt" id="how-it-works">
            <div class="container">
              <div class="section-head" data-animate>
                <span class="section-kicker">Quick Start</span>
                <h2>四步开始使用</h2>
                <p>从注册到使用，最快 3 分钟。</p>
              </div>
              <div class="steps-grid" data-animate>
                <article class="glass-card step-card">
                  <span class="step-num">01</span>
                  <h3>注册账号</h3>
                  <p>支持邮箱注册，注册即送免费额度。</p>
                </article>
                <article class="glass-card step-card">
                  <span class="step-num">02</span>
                  <h3>创建 API Key</h3>
                  <p>进入后台一键创建，每个工具单独一个。</p>
                </article>
                <article class="glass-card step-card">
                  <span class="step-num">03</span>
                  <h3>配置工具</h3>
                  <p>填入 Base URL 和 Key 即可接入。</p>
                </article>
                <article class="glass-card step-card">
                  <span class="step-num">04</span>
                  <h3>开始使用</h3>
                  <p>国内直连，无需魔法，稳定省心。</p>
                </article>
              </div>
            </div>
          </section>

          <section class="pricing-section section" id="pricing">
            <div class="container">
              <div class="section-head" data-animate>
                <span class="section-kicker">Pricing</span>
                <h2>按量计费，透明可控</h2>
                <p>价格、分组、可用模型以控制台为准。</p>
              </div>
              <div class="pricing-card glass-card" data-animate>
                <div class="pricing-options">
                  <span>按量计费</span>
                  <span>日卡 / 周卡 / 月卡</span>
                  <span>用量实时可查</span>
                  <span>注册送体验额度</span>
                </div>
                <p class="pricing-desc">注册即送免费体验额度，用量与扣费记录全程可查。</p>
                <div class="hero-actions">
                  <a class="btn btn-primary btn-lg primary-action" href="/register">立即注册</a>
                  <a class="btn btn-outline btn-lg secondary-action" href="/docs/models">查看模型与价格</a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <nav class="page-rail" id="pageRail" aria-label="页面导航">
          <button type="button" data-section="hero" aria-label="首页" aria-current="true"><span>01</span></button>
          <button type="button" data-section="access" aria-label="API 接入"><span>02</span></button>
          <button type="button" data-section="tools" aria-label="工具入口"><span>03</span></button>
          <button type="button" data-section="inspiration" aria-label="灵感广场"><span>04</span></button>
          <button type="button" data-section="features" aria-label="核心优势"><span>05</span></button>
          <button type="button" data-section="pricing" aria-label="价格"><span>06</span></button>
        </nav>

        <footer class="home-footer">
          <div class="container footer-inner">
            <div class="footer-brand">
              <span class="brand-mark brand-mark--sm" aria-hidden="true"></span>
              <div>
                <strong data-site-name>__SITE_NAME__</strong>
                <span>稳定、安全、口碑优先</span>
              </div>
            </div>
            <div class="footer-cols">
              <div class="footer-col">
                <h4>产品</h4>
                <a href="/">用户首页</a>
                <a href="/dashboard">用户后台</a>
                <a href="/image-playground">生图工作站</a>
                <a href="/docs/models">模型广场</a>
              </div>
              <div class="footer-col">
                <h4>文档</h4>
                <a href="/docs">使用文档</a>
                <a href="/docs#quick-start">快速开始</a>
              </div>
              <div class="footer-col">
                <h4>联系</h4>
                <a href="#">QQ 群 98914420</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="container">&copy; <span data-site-year></span> <span data-site-name>__SITE_NAME__</span></div>
          </div>
        </footer>
      </div>

      <div class="mobile-overlay" id="mobileOverlay"></div>
  </div>

  <LoginAgreementPrompt
    v-if="loginAgreementEnabled"
    :accepted="agreementAccepted"
    :documents="loginAgreementDocuments"
    mode="modal"
    :updated-at="loginAgreementUpdatedAt"
    :visible="showAgreementModal"
    @accept="acceptLoginAgreement"
    @reject="rejectLoginAgreement"
    @open="showAgreementModal = true"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { getPublicSettings } from '@/api/auth'
import LoginAgreementPrompt from '@/components/auth/LoginAgreementPrompt.vue'
import { useLoginAgreement } from '@/composables/useLoginAgreement'
import { initMarketingHomePage, destroyMarketingHomePage } from './marketing-home.js'

const CDN = (import.meta.env.VITE_STATIC_CDN || 'https://assets.cangyuansuanli.cn').replace(/\/$/, '')

const pageRoot = ref<HTMLElement | null>(null)

const {
  loginAgreementEnabled,
  loginAgreementDocuments,
  loginAgreementUpdatedAt,
  agreementAccepted,
  applyLoginAgreementSettings,
  acceptLoginAgreement,
  rejectLoginAgreement,
  showAgreementModal,
} = useLoginAgreement()

onMounted(async () => {
  document.body.classList.add('boot-active', 'marketing-home-active')

  if (!document.querySelector('link[href*="Orbitron"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;600;700&family=DM+Sans:wght@400;500;700&display=swap'
    document.head.appendChild(link)
  }

  await nextTick()
  if (!pageRoot.value) return

  try {
    const settings = await getPublicSettings()
    applyLoginAgreementSettings(settings)
    initMarketingHomePage(pageRoot.value, { publicSettings: settings })
  } catch {
    applyLoginAgreementSettings({})
    initMarketingHomePage(pageRoot.value)
  }
})

onUnmounted(() => {
  if (pageRoot.value) destroyMarketingHomePage(pageRoot.value)
  document.body.classList.remove('boot-active', 'boot-complete', 'menu-open', 'marketing-home-active')
})
</script>

<style src="./MarketingHomeView.css"></style>
