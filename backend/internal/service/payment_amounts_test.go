package service

import "testing"

func TestCreditFromPayAmountPresetTiers(t *testing.T) {
	for _, tier := range defaultRechargeTiers {
		if got := creditFromPayAmount(tier.pay); got != tier.credit {
			t.Fatalf("pay %.2f: got credit %.2f, want %.2f", tier.pay, got, tier.credit)
		}
	}
}

func TestCalculateCreditedBalanceTiered(t *testing.T) {
	cases := []struct {
		pay        float64
		multiplier float64
		want       float64
	}{
		{pay: 10, multiplier: 1, want: 10},
		{pay: 29, multiplier: 1, want: 30},
		{pay: 48, multiplier: 1, want: 50},
		{pay: 96, multiplier: 1, want: 100},
		{pay: 29, multiplier: 1.5, want: 45},
	}
	for _, tc := range cases {
		if got := calculateCreditedBalance(tc.pay, tc.multiplier); got != tc.want {
			t.Fatalf("pay %.2f x %.2f: got %.2f, want %.2f", tc.pay, tc.multiplier, got, tc.want)
		}
	}
}
