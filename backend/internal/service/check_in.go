package service

import "time"

const (
	CheckInDailyReward = 0.25
	CheckInDay4Total   = 0.45
	CheckInDay16Total  = 5.21
	CheckInMilestone4  = 4
	CheckInMilestone16 = 16
)

// UserCheckIn 用户签到记录
type UserCheckIn struct {
	ID          int64
	UserID      int64
	CheckInDate time.Time
	StreakDay   int
	DailyReward float64
	BonusReward float64
	TotalReward float64
	CreatedAt   time.Time
}

// CheckInStatus 签到状态
type CheckInStatus struct {
	CheckedInToday bool
	Streak         int
	NextMilestone  int
	TodayReward    *CheckInRewardPreview
	CalendarMonth  string
	MonthCheckIns  []UserCheckIn
}

// CheckInRewardPreview 今日可领奖励预览
type CheckInRewardPreview struct {
	DailyReward float64
	BonusReward float64
	TotalReward float64
	Milestone   string
}

// CheckInResult 签到结果
type CheckInResult struct {
	Message      string
	DailyReward  float64
	BonusReward  float64
	TotalReward  float64
	Streak       int
	NewBalance   float64
	Milestone    string
	CheckInDate  time.Time
}
