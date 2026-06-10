<template>
  <AppLayout>
    <div class="image-playground-layout">
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
              {{ t('imagePlayground.notEnabledTitle') }}
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-dark-400">
              {{ t('imagePlayground.notEnabledDesc') }}
            </p>
          </div>
        </div>

        <div
          v-else-if="errorKind === 'notConfigured'"
          class="flex h-full items-center justify-center p-10 text-center"
        >
          <div class="max-w-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('imagePlayground.notConfiguredTitle') }}
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-dark-400">
              {{ t('imagePlayground.notConfiguredDesc') }}
            </p>
          </div>
        </div>

        <div
          v-else-if="errorKind === 'noApiKey'"
          class="flex h-full items-center justify-center p-10 text-center"
        >
          <div class="max-w-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('imagePlayground.noApiKeyTitle') }}
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-dark-400">
              {{ t('imagePlayground.noApiKeyDesc') }}
            </p>
            <RouterLink to="/keys" class="btn btn-primary btn-sm mt-4 inline-flex">
              {{ t('imagePlayground.createApiKey') }}
            </RouterLink>
          </div>
        </div>

        <div
          v-else-if="errorKind === 'loadFailed'"
          class="flex h-full items-center justify-center p-10 text-center"
        >
          <div class="max-w-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('imagePlayground.loadFailedTitle') }}
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-dark-400">
              {{ loadErrorMessage || t('imagePlayground.loadFailedDesc') }}
            </p>
          </div>
        </div>

        <div v-else-if="embeddedUrl" class="custom-embed-shell">
          <a
            :href="embeddedUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-secondary btn-sm custom-open-fab"
          >
            <Icon name="externalLink" size="sm" class="mr-1.5" :stroke-width="2" />
            {{ t('imagePlayground.openInNewTab') }}
          </a>
          <iframe
            :src="embeddedUrl"
            class="custom-embed-frame"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'
import Icon from '@/components/icons/Icon.vue'
import { getImagePlaygroundBootstrap } from '@/api/imagePlayground'
import { buildImagePlaygroundUrl, detectTheme } from '@/utils/embedded-url'

type ErrorKind = 'disabled' | 'notConfigured' | 'noApiKey' | 'loadFailed' | null

const { t, locale } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()

const loading = ref(true)
const errorKind = ref<ErrorKind>(null)
const loadErrorMessage = ref('')
const pageTheme = ref<'light' | 'dark'>('light')
const bootstrap = ref<Awaited<ReturnType<typeof getImagePlaygroundBootstrap>> | null>(null)
let themeObserver: MutationObserver | null = null

const embeddedUrl = computed(() => {
  if (!bootstrap.value) return ''
  return buildImagePlaygroundUrl({
    playgroundUrl: bootstrap.value.playground_url,
    apiKey: bootstrap.value.api_key,
    model: bootstrap.value.model,
    apiMode: bootstrap.value.api_mode,
    userId: authStore.user?.id,
    authToken: authStore.token,
    theme: pageTheme.value,
    lang: locale.value,
  })
})

async function loadBootstrap() {
  loading.value = true
  errorKind.value = null
  loadErrorMessage.value = ''
  bootstrap.value = null

  const settings = appStore.cachedPublicSettings
  if (settings?.image_playground_enabled === false) {
    errorKind.value = 'disabled'
    loading.value = false
    return
  }
  if (settings && !settings.image_playground_url?.trim()) {
    errorKind.value = 'notConfigured'
    loading.value = false
    return
  }

  try {
    bootstrap.value = await getImagePlaygroundBootstrap()
  } catch (error) {
    const err = error as { status?: number; message?: string }
    if (err.status === 400) {
      errorKind.value = 'notConfigured'
    } else if (err.status === 404) {
      errorKind.value = 'noApiKey'
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
  if (bootstrap.value) {
    // Recompute embedded URL when locale changes.
    bootstrap.value = { ...bootstrap.value }
  }
})
</script>

<style scoped>
.image-playground-layout {
  @apply flex flex-col;
  height: calc(100vh - 64px - 2rem);
  margin: -0.5rem -0.25rem 0;
}

@media (min-width: 768px) {
  .image-playground-layout {
    margin: -1rem -0.5rem 0;
  }
}

.custom-embed-shell {
  @apply relative h-full w-full overflow-hidden;
  @apply rounded-xl md:rounded-2xl;
  @apply bg-white dark:bg-dark-950;
  @apply p-0;
}

.custom-open-fab {
  @apply absolute right-3 top-3 z-10;
  @apply shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-dark-800/80;
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
