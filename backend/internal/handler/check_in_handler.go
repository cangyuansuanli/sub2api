package handler

import (
	"github.com/Wei-Shaw/sub2api/internal/pkg/response"
	middleware2 "github.com/Wei-Shaw/sub2api/internal/server/middleware"
	"github.com/Wei-Shaw/sub2api/internal/service"

	"github.com/gin-gonic/gin"
)

// CheckInHandler handles daily check-in requests
type CheckInHandler struct {
	checkInService *service.CheckInService
}

// NewCheckInHandler creates a new CheckInHandler
func NewCheckInHandler(checkInService *service.CheckInService) *CheckInHandler {
	return &CheckInHandler{checkInService: checkInService}
}

type checkInRewardPreviewResponse struct {
	DailyReward float64 `json:"daily_reward"`
	BonusReward float64 `json:"bonus_reward"`
	TotalReward float64 `json:"total_reward"`
	Milestone   string  `json:"milestone,omitempty"`
}

type checkInRecordResponse struct {
	Date        string  `json:"date"`
	StreakDay   int     `json:"streak_day"`
	DailyReward float64 `json:"daily_reward"`
	BonusReward float64 `json:"bonus_reward"`
	TotalReward float64 `json:"total_reward"`
}

type checkInRulesResponse struct {
	DailyReward float64 `json:"daily_reward"`
	Day4Total   float64 `json:"day4_total"`
	Day16Total  float64 `json:"day16_total"`
}

type checkInStatusResponse struct {
	CheckedInToday bool                          `json:"checked_in_today"`
	Streak         int                           `json:"streak"`
	NextMilestone  int                           `json:"next_milestone"`
	TodayReward    *checkInRewardPreviewResponse `json:"today_reward,omitempty"`
	Rules          checkInRulesResponse          `json:"rules"`
	CalendarMonth  string                        `json:"calendar_month"`
	MonthCheckIns  []checkInRecordResponse       `json:"month_check_ins"`
}

type checkInResultResponse struct {
	Message     string  `json:"message"`
	DailyReward float64 `json:"daily_reward"`
	BonusReward float64 `json:"bonus_reward"`
	TotalReward float64 `json:"total_reward"`
	Streak      int     `json:"streak"`
	NewBalance  float64 `json:"new_balance"`
	Milestone   string  `json:"milestone,omitempty"`
	Date        string  `json:"date"`
}

// GetStatus handles GET /api/v1/check-in/status
func (h *CheckInHandler) GetStatus(c *gin.Context) {
	subject, ok := middleware2.GetAuthSubjectFromContext(c)
	if !ok {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	status, err := h.checkInService.GetStatus(c.Request.Context(), subject.UserID, c.Query("month"))
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	out := checkInStatusResponse{
		CheckedInToday: status.CheckedInToday,
		Streak:         status.Streak,
		NextMilestone:  status.NextMilestone,
		CalendarMonth:  status.CalendarMonth,
		Rules: checkInRulesResponse{
			DailyReward: service.CheckInDailyReward,
			Day4Total:   service.CheckInDay4Total,
			Day16Total:  service.CheckInDay16Total,
		},
		MonthCheckIns: make([]checkInRecordResponse, 0, len(status.MonthCheckIns)),
	}

	if status.TodayReward != nil {
		out.TodayReward = &checkInRewardPreviewResponse{
			DailyReward: status.TodayReward.DailyReward,
			BonusReward: status.TodayReward.BonusReward,
			TotalReward: status.TodayReward.TotalReward,
			Milestone:   status.TodayReward.Milestone,
		}
	}

	for _, item := range status.MonthCheckIns {
		out.MonthCheckIns = append(out.MonthCheckIns, checkInRecordResponse{
			Date:        item.CheckInDate.Format("2006-01-02"),
			StreakDay:   item.StreakDay,
			DailyReward: item.DailyReward,
			BonusReward: item.BonusReward,
			TotalReward: item.TotalReward,
		})
	}

	response.Success(c, out)
}

// CheckIn handles POST /api/v1/check-in
func (h *CheckInHandler) CheckIn(c *gin.Context) {
	subject, ok := middleware2.GetAuthSubjectFromContext(c)
	if !ok {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	result, err := h.checkInService.CheckIn(c.Request.Context(), subject.UserID)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	response.Success(c, checkInResultResponse{
		Message:     result.Message,
		DailyReward: result.DailyReward,
		BonusReward: result.BonusReward,
		TotalReward: result.TotalReward,
		Streak:      result.Streak,
		NewBalance:  result.NewBalance,
		Milestone:   result.Milestone,
		Date:        result.CheckInDate.Format("2006-01-02"),
	})
}
