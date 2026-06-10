package service

import (
	"math"

	"github.com/Wei-Shaw/sub2api/internal/payment"
	"github.com/shopspring/decimal"
)

const defaultBalanceRechargeMultiplier = 1.0

type rechargeTier struct {
	pay    float64
	credit float64
}

// Preset tiers aligned with storefront reference pricing.
var defaultRechargeTiers = []rechargeTier{
	{pay: 1, credit: 1},
	{pay: 3, credit: 3},
	{pay: 5, credit: 5},
	{pay: 10, credit: 10},
	{pay: 29, credit: 30},
	{pay: 48, credit: 50},
	{pay: 96, credit: 100},
}

func normalizeBalanceRechargeMultiplier(multiplier float64) float64 {
	if math.IsNaN(multiplier) || math.IsInf(multiplier, 0) || multiplier <= 0 {
		return defaultBalanceRechargeMultiplier
	}
	return multiplier
}

func creditFromPayAmount(paymentAmount float64) float64 {
	if paymentAmount <= 0 {
		return 0
	}
	for _, tier := range defaultRechargeTiers {
		if math.Abs(paymentAmount-tier.pay) < 0.005 {
			return tier.credit
		}
	}
	if paymentAmount < 29 {
		return roundMoney(paymentAmount)
	}
	if paymentAmount < 48 {
		return roundMoney(paymentAmount * 30 / 29)
	}
	if paymentAmount < 96 {
		return roundMoney(paymentAmount * 50 / 48)
	}
	return roundMoney(paymentAmount * 100 / 96)
}

func calculateCreditedBalance(paymentAmount, multiplier float64) float64 {
	credit := creditFromPayAmount(paymentAmount)
	return decimal.NewFromFloat(credit).
		Mul(decimal.NewFromFloat(normalizeBalanceRechargeMultiplier(multiplier))).
		Round(2).
		InexactFloat64()
}

func roundMoney(value float64) float64 {
	return decimal.NewFromFloat(value).Round(2).InexactFloat64()
}

func calculateGatewayRefundAmount(orderAmount, payAmount, refundAmount float64, currency string) float64 {
	if orderAmount <= 0 || payAmount <= 0 || refundAmount <= 0 {
		return 0
	}
	fractionDigits := int32(payment.CurrencyMaxFractionDigits(currency))
	if math.Abs(refundAmount-orderAmount) <= paymentAmountToleranceForCurrency(currency) {
		return decimal.NewFromFloat(payAmount).Round(fractionDigits).InexactFloat64()
	}
	return decimal.NewFromFloat(payAmount).
		Mul(decimal.NewFromFloat(refundAmount)).
		Div(decimal.NewFromFloat(orderAmount)).
		Round(fractionDigits).
		InexactFloat64()
}
