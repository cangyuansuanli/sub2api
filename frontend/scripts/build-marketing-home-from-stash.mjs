#!/usr/bin/env node
/**
 * One-off generator: stash WIP public/home → MarketingHomeView.vue template body.
 * Source: git stash@{0} on feat/home-ohlaoo-style
 */

import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const html = execSync('git show stash@{0}:frontend/public/home/index.html', {
  cwd: join(ROOT, '..'),
  encoding: 'utf8',
})

let body = html
  .replace(/^[\s\S]*<body class="boot-active">\s*/i, '')
  .replace(/\s*<script[\s\S]*$/i, '')
  .trim()

body = body
  .replace(/href="\/home\/?"/g, 'href="/"')
  .replace(/href="\/docs\/index\.html/g, 'href="/docs')
  .replace(/href="\/docs\/models\.html"/g, 'href="/docs/models"')
  .replace(/<code>\/docs\/index\.html<\/code>/g, '<code>/docs</code>')
  .replace(/src="\.\/assets\/logo\.png"/g, ':src="`${CDN}/site/logo.png`"')
  .replace(/src="\.\/assets\/models\//g, ':src="`${CDN}/home/models/')
  .replace(/src="\.\/assets\/tools\//g, ':src="`${CDN}/home/tools/')
  .replace(/src="\.\/assets\/inspiration\//g, ':src="`${CDN}/home/inspiration/')
  .replace(/:src="`\$\{CDN\}\/home\/models\/([^"]+)"/g, ':src="`${CDN}/home/models/$1`"')
  .replace(/:src="`\$\{CDN\}\/home\/tools\/([^"]+)"/g, ':src="`${CDN}/home/tools/$1`"')
  .replace(/:src="`\$\{CDN\}\/home\/inspiration\/([^"]+)"/g, ':src="`${CDN}/home/inspiration/$1`"')

body = body.replace(/沧元算力/g, '__SITE_NAME__')

const vue = `<template>
  <div ref="pageRoot" class="marketinghomeview-page">
${body.split('\n').map((line) => (line ? `    ${line}` : '')).join('\n')}
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
import type { LoginAgreementDocument } from '@/types'
import { initMarketingHomePage, destroyMarketingHomePage } from './marketing-home.js'

const CDN = (import.meta.env.VITE_STATIC_CDN || 'https://assets.cangyuansuanli.cn').replace(/\\/$/, '')

const pageRoot = ref<HTMLElement | null>(null)

const LOGIN_AGREEMENT_STORAGE_KEY = 'sub2api_login_agreement_consent'
const loginAgreementEnabled = ref(false)
const loginAgreementDocuments = ref<LoginAgreementDocument[]>([])
const loginAgreementUpdatedAt = ref('')
const loginAgreementRevision = ref('')
const agreementAccepted = ref(true)
const showAgreementModal = ref(false)

function hasAcceptedLoginAgreement(revision: string): boolean {
  if (!revision) return false
  try {
    const raw = localStorage.getItem(LOGIN_AGREEMENT_STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { revision?: string }
    return parsed.revision === revision
  } catch {
    return false
  }
}

function applyLoginAgreementSettings(settings: {
  login_agreement_enabled?: boolean
  login_agreement_updated_at?: string
  login_agreement_revision?: string
  login_agreement_documents?: LoginAgreementDocument[]
}): void {
  const documents = Array.isArray(settings.login_agreement_documents)
    ? settings.login_agreement_documents.filter((doc) => doc.title?.trim())
    : []
  loginAgreementDocuments.value = documents
  loginAgreementEnabled.value = settings.login_agreement_enabled === true && documents.length > 0
  loginAgreementUpdatedAt.value = settings.login_agreement_updated_at || ''
  loginAgreementRevision.value =
    settings.login_agreement_revision ||
    \`\${loginAgreementUpdatedAt.value}:\${documents.map((doc) => \`\${doc.id}:\${doc.title}\`).join('|')}\`

  agreementAccepted.value =
    !loginAgreementEnabled.value || hasAcceptedLoginAgreement(loginAgreementRevision.value)
  showAgreementModal.value = loginAgreementEnabled.value && !agreementAccepted.value
}

function acceptLoginAgreement(): void {
  if (loginAgreementRevision.value) {
    localStorage.setItem(
      LOGIN_AGREEMENT_STORAGE_KEY,
      JSON.stringify({
        revision: loginAgreementRevision.value,
        accepted_at: new Date().toISOString(),
      })
    )
  }
  agreementAccepted.value = true
  showAgreementModal.value = false
}

function rejectLoginAgreement(): void {
  localStorage.removeItem(LOGIN_AGREEMENT_STORAGE_KEY)
  agreementAccepted.value = false
  showAgreementModal.value = false
}

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
    loginAgreementEnabled.value = false
    agreementAccepted.value = true
    initMarketingHomePage(pageRoot.value)
  }
})

onUnmounted(() => {
  if (pageRoot.value) destroyMarketingHomePage(pageRoot.value)
  document.body.classList.remove('boot-active', 'boot-complete', 'menu-open', 'marketing-home-active')
})
</script>

<style src="./MarketingHomeView.css"></style>
`

writeFileSync(join(ROOT, 'src/views/site/MarketingHomeView.vue'), vue)
console.log('Wrote MarketingHomeView.vue')
