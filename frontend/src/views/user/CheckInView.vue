<template>
  <AppLayout>
    <div class="mx-auto max-w-3xl space-y-6">
      <div v-if="loading" class="flex justify-center py-16">
        <div
          class="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"
        />
      </div>

      <template v-else-if="status">
        <!-- Hero -->
        <div class="card overflow-hidden">
          <div class="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-6 py-8 text-white">
            <div class="flex flex-col items-center text-center">
              <div
                class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
              >
                <Icon name="calendar" size="xl" class="text-white" />
              </div>
              <p class="text-sm font-medium text-white/90">{{ t('checkIn.subtitle') }}</p>
              <p class="mt-2 text-5xl font-bold">{{ status.streak }}</p>
              <p class="mt-1 text-sm text-white/90">{{ t('checkIn.streakDays') }}</p>
              <p v-if="status.checked_in_today" class="mt-3 text-sm font-medium text-emerald-100">
                {{ t('checkIn.checkedInToday') }}
              </p>
              <p v-else class="mt-3 text-sm text-white/90">
                {{ t('checkIn.nextReward') }}:
                <span class="font-semibold">{{ formatCurrency(previewTotal, 2) }}</span>
              </p>
            </div>
          </div>

          <div class="px-6 py-5">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-dark-300">{{ t('checkIn.progress') }}</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ progressLabel }}
              </span>
            </div>
            <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-800">
              <div
                class="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                :style="{ width: `${progressPercent}%` }"
              />
            </div>
            <div class="mt-3 flex justify-between text-xs text-gray-500 dark:text-dark-400">
              <span>{{ t('checkIn.milestoneDay4') }}</span>
              <span>{{ t('checkIn.milestoneDay16') }}</span>
            </div>
          </div>
        </div>

        <!-- Check-in button -->
        <div class="card p-6">
          <button
            type="button"
            class="btn w-full py-3 text-base"
            :class="status.checked_in_today ? 'btn-secondary cursor-not-allowed' : 'btn-primary'"
            :disabled="status.checked_in_today || submitting"
            @click="handleCheckIn"
          >
            <svg
              v-if="submitting"
              class="-ml-1 mr-2 h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <Icon v-else name="checkCircle" size="md" class="mr-2" />
            {{
              submitting
                ? t('checkIn.checkingIn')
                : status.checked_in_today
                  ? t('checkIn.alreadyCheckedIn')
                  : t('checkIn.checkInButton')
            }}
          </button>

          <transition name="fade">
            <div
              v-if="successResult"
              class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/50 dark:bg-emerald-900/20"
            >
              <p class="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                {{ t('checkIn.successTitle') }}
              </p>
              <p class="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                {{ t('checkIn.successAmount', { amount: formatCurrency(successResult.total_reward, 2) }) }}
                <span v-if="successResult.milestone === 'day4'">
                  · {{ t('checkIn.milestoneReachedDay4') }}
                </span>
                <span v-else-if="successResult.milestone === 'day16'">
                  · {{ t('checkIn.milestoneReachedDay16') }}
                </span>
              </p>
            </div>
          </transition>

          <transition name="fade">
            <div
              v-if="errorMessage"
              class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20"
            >
              <p class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</p>
            </div>
          </transition>
        </div>

        <!-- Milestones -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="card p-5">
            <p class="text-sm text-gray-500 dark:text-dark-400">{{ t('checkIn.dailyReward') }}</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(status.rules.daily_reward, 2) }}
            </p>
          </div>
          <div class="card p-5">
            <p class="text-sm text-gray-500 dark:text-dark-400">{{ t('checkIn.nextMilestone') }}</p>
            <p class="mt-2 text-2xl font-semibold text-amber-600 dark:text-amber-400">
              {{ t('checkIn.dayLabel', { day: status.next_milestone }) }}
            </p>
          </div>
        </div>

        <!-- Rules -->
        <div class="card border-amber-200 bg-amber-50 p-6 dark:border-amber-800/50 dark:bg-amber-900/20">
          <div class="flex items-start gap-4">
            <div
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30"
            >
              <Icon name="infoCircle" size="md" class="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-amber-900 dark:text-amber-200">
                {{ t('checkIn.rulesTitle') }}
              </h3>
              <ul class="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800 dark:text-amber-300">
                <li>{{ t('checkIn.ruleDaily', { amount: formatCurrency(status.rules.daily_reward, 2) }) }}</li>
                <li>
                  {{ t('checkIn.ruleDay4', { total: formatCurrency(status.rules.day4_total, 2) }) }}
                </li>
                <li>
                  {{ t('checkIn.ruleDay16', { total: formatCurrency(status.rules.day16_total, 2) }) }}
                </li>
                <li>{{ t('checkIn.ruleNonRefundable') }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Monthly calendar -->
        <div class="card">
          <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-dark-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ calendarTitle }}
            </h2>
            <div class="flex items-center gap-2">
              <button type="button" class="btn btn-secondary btn-sm" @click="shiftMonth(-1)">
                ‹
              </button>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                :disabled="isCurrentMonth"
                @click="goToCurrentMonth"
              >
                {{ t('checkIn.thisMonth') }}
              </button>
              <button type="button" class="btn btn-secondary btn-sm" @click="shiftMonth(1)">
                ›
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500 dark:text-dark-400">
              <span v-for="label in weekdayLabels" :key="label">{{ label }}</span>
            </div>
            <div class="grid grid-cols-7 gap-2">
              <div
                v-for="(cell, index) in calendarCells"
                :key="`${cell.date || 'empty'}-${index}`"
                class="flex min-h-[4.5rem] flex-col items-center justify-center rounded-xl border px-1 py-2 text-center"
                :class="calendarCellClass(cell)"
              >
                <template v-if="cell.day">
                  <span
                    class="text-sm font-semibold"
                    :class="cell.isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'"
                  >
                    {{ cell.day }}
                  </span>
                  <Icon
                    v-if="cell.checked"
                    name="checkCircle"
                    size="sm"
                    class="mt-1 text-emerald-500"
                  />
                  <span
                    v-else-if="cell.isPastOrToday"
                    class="mt-1 h-4 w-4 rounded-full border border-dashed border-gray-300 dark:border-dark-600"
                  />
                  <span
                    v-if="cell.record"
                    class="mt-1 text-[10px] leading-tight text-emerald-600 dark:text-emerald-400"
                  >
                    +{{ formatCurrency(cell.record.total_reward, 2) }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'
import Icon from '@/components/icons/Icon.vue'
import { checkInAPI, type CheckInRecord, type CheckInResult, type CheckInStatus } from '@/api/checkIn'
import { useAuthStore } from '@/stores/auth'
import { formatCurrency } from '@/utils/format'
import { getLocale } from '@/i18n'

interface CalendarCell {
  day: number | null
  date: string | null
  checked: boolean
  isToday: boolean
  isPastOrToday: boolean
  record: CheckInRecord | null
}

function resolveErrorMessage(error: unknown, fallback: string): string {
  const detail = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail
  return detail || fallback
}

function formatMonthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`
}

function parseMonthKey(key: string): { year: number; monthIndex: number } {
  const [yearText, monthText] = key.split('-')
  return { year: Number(yearText), monthIndex: Number(monthText) - 1 }
}

function todayMonthKey(): string {
  const now = new Date()
  return formatMonthKey(now.getFullYear(), now.getMonth())
}

const { t } = useI18n()
const authStore = useAuthStore()

const loading = ref(true)
const submitting = ref(false)
const status = ref<CheckInStatus | null>(null)
const successResult = ref<CheckInResult | null>(null)
const errorMessage = ref('')
const selectedMonth = ref(todayMonthKey())

const previewTotal = computed(() => {
  if (!status.value?.today_reward) {
    return status.value?.rules.daily_reward ?? 0
  }
  return status.value.today_reward.total_reward
})

const progressPercent = computed(() => {
  if (!status.value) return 0
  return Math.min(100, (status.value.streak / 16) * 100)
})

const progressLabel = computed(() => {
  if (!status.value) return ''
  return t('checkIn.progressLabel', { current: status.value.streak, total: 16 })
})

const checkedDateMap = computed(() => {
  const map = new Map<string, CheckInRecord>()
  for (const item of status.value?.month_check_ins ?? []) {
    map.set(item.date, item)
  }
  return map
})

const weekdayLabels = computed(() => {
  if (getLocale().startsWith('zh')) {
    return ['一', '二', '三', '四', '五', '六', '日']
  }
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
})

const calendarTitle = computed(() => {
  const { year, monthIndex } = parseMonthKey(selectedMonth.value)
  const formatter = new Intl.DateTimeFormat(getLocale(), { year: 'numeric', month: 'long' })
  return formatter.format(new Date(year, monthIndex, 1))
})

const isCurrentMonth = computed(() => selectedMonth.value === todayMonthKey())

const calendarCells = computed((): CalendarCell[] => {
  const { year, monthIndex } = parseMonthKey(selectedMonth.value)
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const cells: CalendarCell[] = Array.from({ length: startOffset }, () => ({
    day: null,
    date: null,
    checked: false,
    isToday: false,
    isPastOrToday: false,
    record: null
  }))

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const record = checkedDateMap.value.get(date) ?? null
    const cellDate = new Date(year, monthIndex, day)
    cells.push({
      day,
      date,
      checked: Boolean(record),
      isToday: date === todayKey,
      isPastOrToday: cellDate <= new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      record
    })
  }

  return cells
})

function calendarCellClass(cell: CalendarCell): string {
  if (!cell.day) {
    return 'border-transparent bg-transparent'
  }
  if (cell.checked) {
    return 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/40 dark:bg-emerald-900/20'
  }
  if (cell.isToday) {
    return 'border-primary-200 bg-primary-50/60 dark:border-primary-800/40 dark:bg-primary-900/10'
  }
  return 'border-gray-100 bg-gray-50/50 dark:border-dark-700 dark:bg-dark-900/40'
}

async function loadStatus(month = selectedMonth.value) {
  loading.value = true
  errorMessage.value = ''
  try {
    status.value = await checkInAPI.getStatus(month)
    selectedMonth.value = status.value.calendar_month || month
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error, t('checkIn.loadFailed'))
  } finally {
    loading.value = false
  }
}

function shiftMonth(delta: number) {
  const { year, monthIndex } = parseMonthKey(selectedMonth.value)
  const next = new Date(year, monthIndex + delta, 1)
  selectedMonth.value = formatMonthKey(next.getFullYear(), next.getMonth())
  loadStatus(selectedMonth.value)
}

function goToCurrentMonth() {
  selectedMonth.value = todayMonthKey()
  loadStatus(selectedMonth.value)
}

async function handleCheckIn() {
  if (!status.value || status.value.checked_in_today || submitting.value) return

  submitting.value = true
  errorMessage.value = ''
  successResult.value = null

  try {
    const result = await checkInAPI.checkIn()
    successResult.value = result
    await authStore.refreshUser()
    await loadStatus(selectedMonth.value)
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error, t('checkIn.checkInFailed'))
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadStatus()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
