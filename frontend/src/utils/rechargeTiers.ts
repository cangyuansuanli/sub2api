export interface RechargeTier {
  credit: number
  pay: number
}

/** Preset tiers aligned with reference store pricing (pay CNY → credit balance). */
export const RECHARGE_TIERS: RechargeTier[] = [
  { credit: 1, pay: 1 },
  { credit: 3, pay: 3 },
  { credit: 5, pay: 5 },
  { credit: 10, pay: 10 },
  { credit: 30, pay: 29 },
  { credit: 50, pay: 48 },
  { credit: 100, pay: 96 },
]

export const RECHARGE_TIER_CREDITS = RECHARGE_TIERS.map((tier) => tier.credit)

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

/** Convert desired credit balance to the discounted pay amount. */
export function payFromCredit(credit: number): number {
  if (credit <= 0) return 0
  if (credit < 30) return roundMoney(credit)
  if (credit < 50) return roundMoney((credit * 29) / 30)
  if (credit < 100) return roundMoney((credit * 48) / 50)
  return roundMoney((credit * 96) / 100)
}

/** Convert pay amount back to credited balance (preset exact match first). */
export function creditFromPay(pay: number): number {
  if (pay <= 0) return 0
  for (const tier of RECHARGE_TIERS) {
    if (Math.abs(pay - tier.pay) < 0.005) return tier.credit
  }
  if (pay < 29) return roundMoney(pay)
  if (pay < 48) return roundMoney((pay * 30) / 29)
  if (pay < 96) return roundMoney((pay * 50) / 48)
  return roundMoney((pay * 100) / 96)
}

export function tierDiscountPercent(credit: number): number | null {
  const pay = payFromCredit(credit)
  if (pay >= credit) return null
  return Math.round((1 - pay / credit) * 100)
}

export function tierUnitRate(credit: number): number {
  const pay = payFromCredit(credit)
  if (credit <= 0) return 1
  return roundMoney(pay / credit)
}
