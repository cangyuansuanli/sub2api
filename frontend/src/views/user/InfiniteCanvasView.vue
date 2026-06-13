<template>
  <AppLayout>
    <div class="infinite-canvas-layout">
      <div class="card flex-1 min-h-0 overflow-hidden">
        <div v-if="loading" class="flex h-full items-center justify-center py-12">
          <div
            class="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"
          ></div>
        </div>

        <div
          v-else-if="errorKind === 'disabled'"
          class="flex h-full items-center justify-center p-10 text-center"
        >
          <div class="max-w-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('infiniteCanvas.notEnabledTitle') }}
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-dark-400">
              {{ t('infiniteCanvas.notEnabledDesc') }}
            </p>
          </div>
        </div>

        <div
          v-else-if="errorKind === 'notConfigured'"
          class="flex h-full items-center justify-center p-10 text-center"
        >
          <div class="max-w-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('infiniteCanvas.notConfiguredTitle') }}
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-dark-400">
              {{ t('infiniteCanvas.notConfiguredDesc') }}
            </p>
          </div>
        </div>

        <div
          v-else-if="errorKind === 'loadFailed'"
          class="flex h-full items-center justify-center p-10 text-center"
        >
          <div class="max-w-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('infiniteCanvas.loadFailedTitle') }}
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-dark-400">
              {{ loadErrorMessage || t('infiniteCanvas.loadFailedDesc') }}
            </p>
          </div>
        </div>

        <div v-else-if="embeddedUrl" class="custom-embed-shell">
          <div class="custom-toolbar-fab">
            <button type="button" class="btn btn-secondary btn-sm" @click="openApiKeyModal">
              <Icon name="key" size="sm" class="mr-1.5" :stroke-width="2" />
              {{ t('infiniteCanvas.changeApiKey') }}
            </button>
            <a
              :href="embeddedUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary btn-sm"
            >
              <Icon name="externalLink" size="sm" class="mr-1.5" :stroke-width="2" />
              {{ t('infiniteCanvas.openInNewTab') }}
            </a>
          </div>
          <iframe :src="embeddedUrl" class="custom-embed-frame" allowfullscreen></iframe>
        </div>
      </div>
    </div>

    <BaseDialog
      :show="showApiKeyModal"
      :title="t('infiniteCanvas.apiKeyModal.title')"
      width="normal"
      :close-on-click-outside="false"
      :close-on-escape="!apiKeyModalRequired"
      :show-close-button="!apiKeyModalRequired"
      @close="closeApiKeyModal"
    >
      <p class="text-sm text-gray-600 dark:text-dark-300">
        {{ t('infiniteCanvas.apiKeyModal.description') }}
      </p>
      <div class="mt-4">
        <label class="input-label" for="infinite-canvas-api-key">
          {{ t('keys.apiKey') }}
        </label>
        <input
          id="infinite-canvas-api-key"
          v-model="apiKeyInput"
          type="password"
          class="input mt-1"
          :placeholder="t('infiniteCanvas.apiKeyModal.placeholder')"
          autocomplete="off"
          @keyup.enter="confirmApiKey"
        />
        <p v-if="apiKeyInputError" class="input-error mt-1">{{ apiKeyInputError }}</p>
        <p class="input-hint mt-2">{{ t('infiniteCanvas.apiKeyModal.hint') }}</p>
      </div>
      <template #footer>
        <RouterLink to="/keys" class="btn btn-secondary btn-sm">
          {{ t('infiniteCanvas.createApiKey') }}
        </RouterLink>
        <button type="button" class="btn btn-primary btn-sm" @click="confirmApiKey">
          {{ t('infiniteCanvas.apiKeyModal.confirm') }}
        </button>
      </template>
    </BaseDialog>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
import Icon from '@/components/icons/Icon.vue'
import { getInfiniteCanvasBootstrap, type InfiniteCanvasBootstrap } from '@/api/infiniteCanvas'
import { buildInfiniteCanvasUrl, detectTheme } from '@/utils/embedded-url'
import {
  getSavedInfiniteCanvasApiKey,
  saveInfiniteCanvasApiKey,
} from '@/utils/infiniteCanvasStorage'

type ErrorKind = 'disabled' | 'notConfigured' | 'loadFailed' | null

const { t, locale } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()

const loading = ref(true)
const errorKind = ref<ErrorKind>(null)
const loadErrorMessage = ref('')
const pageTheme = ref<'light' | 'dark'>('light')
const canvasConfig = ref<InfiniteCanvasBootstrap | null>(null)
const savedApiKey = ref('')
const showApiKeyModal = ref(false)
const apiKeyModalRequired = ref(false)
const apiKeyInput = ref('')
const apiKeyInputError = ref('')
let themeObserver: MutationObserver | null = null

const embeddedUrl = computed(() => {
  if (!canvasConfig.value || !savedApiKey.value) return ''
  return buildInfiniteCanvasUrl({
    canvasUrl: canvasConfig.value.canvas_url,
    apiKey: savedApiKey.value,
    apiBaseUrl: canvasConfig.value.api_base_url,
    userId: authStore.user?.id,
    authToken: authStore.token,
    theme: pageTheme.value,
    lang: locale.value,
  })
})

function openApiKeyModal() {
  apiKeyInput.value = savedApiKey.value
  apiKeyInputError.value = ''
  apiKeyModalRequired.value = false
  showApiKeyModal.value = true
}

function closeApiKeyModal() {
  if (apiKeyModalRequired.value) return
  showApiKeyModal.value = false
  apiKeyInputError.value = ''
}

function confirmApiKey() {
  const trimmed = apiKeyInput.value.trim()
  if (!trimmed) {
    apiKeyInputError.value = t('infiniteCanvas.apiKeyModal.invalidKey')
    return
  }

  saveInfiniteCanvasApiKey(authStore.user?.id, trimmed)
  savedApiKey.value = trimmed
  apiKeyInputError.value = ''
  showApiKeyModal.value = false
  apiKeyModalRequired.value = false
}

function promptApiKeyIfNeeded() {
  const stored = getSavedInfiniteCanvasApiKey(authStore.user?.id)
  if (stored) {
    savedApiKey.value = stored
    return
  }

  apiKeyInput.value = ''
  apiKeyInputError.value = ''
  apiKeyModalRequired.value = true
  showApiKeyModal.value = true
}

async function loadBootstrap() {
  loading.value = true
  errorKind.value = null
  loadErrorMessage.value = ''
  canvasConfig.value = null
  savedApiKey.value = ''

  const settings = appStore.cachedPublicSettings
  if (settings?.infinite_canvas_enabled === false) {
    errorKind.value = 'disabled'
    loading.value = false
    return
  }
  if (settings && !settings.infinite_canvas_url?.trim()) {
    errorKind.value = 'notConfigured'
    loading.value = false
    return
  }

  try {
    canvasConfig.value = await getInfiniteCanvasBootstrap()
    promptApiKeyIfNeeded()
  } catch (error) {
    const err = error as { status?: number; message?: string }
    if (err.status === 400) {
      errorKind.value = 'notConfigured'
    } else {
      errorKind.value = 'loadFailed'
      loadErrorMessage.value = err.message || ''
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  pageTheme.value = detectTheme()
  themeObserver = new MutationObserver(() => {
    pageTheme.value = detectTheme()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  void loadBootstrap()
})

onUnmounted(() => {
  themeObserver?.disconnect()
  themeObserver = null
})

watch(locale, () => {
  if (canvasConfig.value && savedApiKey.value) {
    canvasConfig.value = { ...canvasConfig.value }
  }
})
</script>

<style scoped>
.infinite-canvas-layout {
  @apply flex flex-col;
  height: calc(100vh - 64px - 2rem);
  margin: -0.5rem -0.25rem 0;
}

@media (min-width: 768px) {
  .infinite-canvas-layout {
    margin: -1rem -0.5rem 0;
  }
}

.custom-embed-shell {
  @apply relative h-full w-full overflow-hidden;
  @apply rounded-xl md:rounded-2xl;
  @apply bg-white dark:bg-dark-950;
  @apply p-0;
}

.custom-toolbar-fab {
  @apply absolute right-3 top-3 z-10 flex gap-2;
  @apply shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-dark-800/80;
  @apply rounded-lg p-1;
}

.custom-embed-frame {
  display: block;
  margin: 0;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
}
</style>
