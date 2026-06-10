<template>
  <div class="overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50/60 shadow-sm dark:border-amber-900/40 dark:from-amber-950/30 dark:via-dark-800 dark:to-orange-950/20">
    <div class="flex items-start gap-3 px-4 py-3.5 sm:px-5">
      <div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-amber-900 dark:text-amber-200">{{ t('payment.announcementTitle') }}</p>
        <ul class="mt-1.5 space-y-1 text-sm leading-relaxed text-amber-800/90 dark:text-amber-100/80">
          <li v-for="line in announcementLines" :key="line" class="flex items-start gap-2">
            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
            <span>{{ line }}</span>
          </li>
        </ul>
        <p v-if="extraText" class="mt-2 text-xs text-amber-700/80 dark:text-amber-200/70">{{ extraText }}</p>
      </div>
    </div>
    <div v-if="imageUrl" class="border-t border-amber-100 px-4 py-3 dark:border-amber-900/30 sm:px-5">
      <img
        :src="imageUrl"
        alt=""
        class="mx-auto h-32 max-w-full cursor-pointer rounded-xl object-contain transition-opacity hover:opacity-80"
        @click="emit('preview-image', imageUrl)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  extraText?: string
  imageUrl?: string
}>()

const emit = defineEmits<{
  'preview-image': [url: string]
}>()

const { t, tm } = useI18n()

const announcementLines = computed(() => {
  const lines = tm('payment.announcementLines') as string[] | string
  return Array.isArray(lines) ? lines : []
})
</script>
