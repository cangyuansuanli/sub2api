import { describe, expect, it } from 'vitest'
import {
  RECHARGE_TIERS,
  creditFromPay,
  payFromCredit,
  tierDiscountPercent,
} from '../rechargeTiers'

describe('rechargeTiers', () => {
  it('matches reference preset tiers', () => {
    for (const tier of RECHARGE_TIERS) {
      expect(payFromCredit(tier.credit)).toBe(tier.pay)
      expect(creditFromPay(tier.pay)).toBe(tier.credit)
    }
  })

  it('applies bracket discounts for custom credit amounts', () => {
    expect(payFromCredit(35)).toBeCloseTo(33.83, 2)
    expect(payFromCredit(80)).toBeCloseTo(76.8, 2)
    expect(payFromCredit(150)).toBeCloseTo(144, 2)
  })

  it('reports discount only when pay is below credit', () => {
    expect(tierDiscountPercent(10)).toBeNull()
    expect(tierDiscountPercent(30)).toBe(3)
    expect(tierDiscountPercent(50)).toBe(4)
    expect(tierDiscountPercent(100)).toBe(4)
  })
})
