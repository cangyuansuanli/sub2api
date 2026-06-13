<template>
  <div ref="pageRoot" class="modelsview-page">
<main class="market-shell">
    <header class="market-header" aria-labelledby="market-title">
      <div class="brand-row">
        <img class="brand-logo" :src="`${CDN}/site/logo.png`" alt="">
        <div>
          <strong>沧元算力</strong>
          <span>API 中转模型广场</span>
        </div>
      </div>
      <div class="title-row">
        <div>
          <p class="eyebrow">Model Marketplace</p>
          <h1 id="market-title">模型广场</h1>
          <p class="header-copy">查看当前支持模型、可用分组和实际计费价格。</p>
        </div>
        <div class="header-actions">
          <a class="text-link" href="/docs">使用文档</a>
          <a class="primary-link" href="/dashboard" target="_blank" rel="noopener">用户后台</a>
        </div>
      </div>
      <dl class="stat-grid" aria-label="模型统计">
        <div>
          <dt>模型</dt>
          <dd id="stat-models">0</dd>
        </div>
        <div>
          <dt>平台</dt>
          <dd id="stat-platforms">0</dd>
        </div>
        <div>
          <dt>分组</dt>
          <dd id="stat-groups">0</dd>
        </div>
        <div>
          <dt>单位</dt>
          <dd id="stat-unit">/M</dd>
        </div>
      </dl>
    </header>

    <section class="market-toolbar" aria-label="模型筛选">
      <div class="filter-block">
        <span class="filter-label">平台</span>
        <div class="segmented" id="platform-tabs" role="tablist" aria-label="按平台筛选"></div>
      </div>
      <div class="filter-block">
        <span class="filter-label">分组</span>
        <div class="segmented" id="group-tabs" role="tablist" aria-label="按分组筛选"></div>
      </div>
      <label class="search-box">
        <span>搜索</span>
        <input id="model-search" type="search" placeholder="输入模型名称" autocomplete="off">
      </label>
    </section>

    <section class="market-content" aria-live="polite">
      <div id="model-sections"></div>
      <div class="empty-state" id="empty-state" hidden>
        <strong>没有匹配的模型</strong>
        <span>换一个关键词或筛选条件再试。</span>
      </div>
    </section>

    <footer class="market-footer">
      <span id="updated-at"></span>
      <span id="unit-description"></span>
    </footer>
  </main>

  <div class="modal-backdrop" id="model-modal" hidden>
    <section class="model-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close" type="button" id="modal-close" aria-label="关闭">×</button>
      <div id="modal-content"></div>
    </section>
  </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { initModelMarketPage, destroyModelMarketPage } from './model-market.js'

const CDN = (import.meta.env.VITE_STATIC_CDN || 'https://assets.cangyuansuanli.cn').replace(/\/$/, '')

const pageRoot = ref<HTMLElement | null>(null)

onMounted(async () => {
  document.title = '模型广场 - 沧元算力'
  await nextTick()
  if (!pageRoot.value) return
  initModelMarketPage(pageRoot.value, {
    dataUrl: '/site/model-market-data.json',
  })
})

onUnmounted(() => {
  destroyModelMarketPage()
})
</script>

<style src="./ModelsView.css"></style>
