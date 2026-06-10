<template>
  <div class="space-y-6">
    <div>
      <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ t('payment.selectProduct') }}</h3>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ t('payment.tierHint') }}</p>
        </div>
        <div class="relative w-full sm:max-w-xs">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            inputmode="decimal"
            :value="customText"
            :placeholder="placeholderText"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-dark-600 dark:bg-dark-700/60 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            @input="handleInput"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <button
          v-for="tier in visibleTiers"
          :key="tier.credit"
          type="button"
          :class="[
            'group relative overflow-hidden rounded-2xl border bg-white p-4 text-left transition-all duration-200',
            'hover:-translate-y-1 hover:shadow-lg',
            'dark:bg-dark-800',
            modelValue === tier.credit
              ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/15'
              : 'border-gray-100 shadow-sm hover:border-blue-200 dark:border-dark-600 dark:hover:border-blue-700',
          ]"
          @click="selectCredit(tier.credit)"
        >
          <div
            class="absolute inset-x-0 top-0 h-1 transition-colors"
            :class="modelValue === tier.credit ? 'bg-blue-500' : 'bg-gray-100 group-hover:bg-blue-200 dark:bg-dark-600'"
          />
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                {{ t('payment.tierCreditLabel', { amount: tier.credit }) }}
              </p>
              <p class="mt-2 text-[28px] font-extrabold leading-none tracking-tight text-blue-600 dark:text-blue-400">
                {{ formatPrice(tier.pay) }}
              </p>
            </div>
            <span
              v-if="modelValue === tier.credit"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
          <div class="mt-3 flex items-center justify-between gap-2">
            <span
              v-if="tier.discount"
              class="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
            >
              {{ t('payment.tierDiscount', { percent: tier.discount }) }}
            </span>
            <span
              v-else
              class="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            >
              {{ t('payment.tierStandardRate') }}
            </span>
            <span class="text-[11px] text-gray-400 dark:text-gray-500">
              {{ t('payment.tierStockOk') }}
            </span>
          </div>
        </button>
      </div>
      <p v-if="customPreview" class="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-dark-700/50 dark:text-slate-300">
        {{ customPreview }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatPaymentAmount, normalizePaymentCurrency } from '@/components/payment/currency'
import {
  RECHARGE_TIER_CREDITS,
  creditFromPay,
  payFromCredit,
  tierDiscountPercent,
} from '@/utils/rechargeTiers'

const props = withDefaults(defineProps<{
  amounts?: number[]
  modelValue: number | null
  min?: number
  max?: number
  currency?: string | null
}>(), {
  amounts: () => RECHARGE_TIER_CREDITS,
  min: 0,
  max: 0,
  currency: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const { t, locale } = useI18n()

const customText = ref('')

const normalizedCurrency = computed(() => normalizePaymentCurrency(props.currency))

const visibleTiers = computed(() =>
  props.amounts
    .map((credit) => ({
      credit,
      pay: payFromCredit(credit),
      discount: tierDiscountPercent(credit),
    }))
    .filter((tier) => {
      if (props.min > 0 && tier.pay < props.min) return false
      if (props.max > 0 && tier.pay > props.max) return false
      return true
    }),
)

const creditMin = computed(() => (props.min > 0 ? creditFromPay(props.min) : 0))
const creditMax = computed(() => (props.max > 0 ? creditFromPay(props.max) : 0))

const placeholderText = computed(() => {
  if (creditMin.value > 0 && creditMax.value > 0) return `${creditMin.value} - ${creditMax.value}`
  if (creditMin.value > 0) return `≥ ${creditMin.value}`
  if (creditMax.value > 0) return `≤ ${creditMax.value}`
  return t('payment.enterAmount')
})

const customPreview = computed(() => {
  const credit = props.modelValue
  if (credit == null || credit <= 0) return ''
  const pay = payFromCredit(credit)
  const discount = tierDiscountPercent(credit)
  if (discount) {
    return t('payment.customAmountPreviewDiscount', {
      credit,
      pay: formatPrice(pay),
      percent: discount,
    })
  }
  return t('payment.customAmountPreview', {
    credit,
    pay: formatPrice(pay),
  })
})

const AMOUNT_PATTERN = /^\d*(\.\d{0,2})?$/

function formatPrice(value: number): string {
  return formatPaymentAmount(value, normalizedCurrency.value, locale.value)
}

function selectCredit(credit: number) {
  customText.value = String(credit)
  emit('update:modelValue', credit)
}

function handleInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (!AMOUNT_PATTERN.test(val)) return
  customText.value = val
  if (val === '') {
    emit('update:modelValue', null)
    return
  }
  const num = parseFloat(val)
  if (!isNaN(num) && num > 0) {
    emit('update:modelValue', num)
  } else {
    emit('update:modelValue', null)
  }
}

watch(() => props.modelValue, (v) => {
  if (v !== null && String(v) !== customText.value) {
    customText.value = String(v)
  }
}, { immediate: true })
</script>
