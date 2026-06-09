package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	dbent "github.com/Wei-Shaw/sub2api/ent"
	"github.com/Wei-Shaw/sub2api/internal/config"
	infraerrors "github.com/Wei-Shaw/sub2api/internal/pkg/errors"
)

var (
	ErrCheckInAlreadyDone = infraerrors.Conflict("CHECK_IN_ALREADY_DONE", "already checked in today")
)

// CheckInRepository 签到仓储
type CheckInRepository interface {
	GetLatestByUser(ctx context.Context, userID int64) (*UserCheckIn, error)
	GetByUserAndDate(ctx context.Context, userID int64, date time.Time) (*UserCheckIn, error)
	Create(ctx context.Context, record *UserCheckIn) error
	ListByUserInMonth(ctx context.Context, userID int64, year int, month time.Month) ([]UserCheckIn, error)
}

// CheckInService 每日签到服务
type CheckInService struct {
	checkInRepo          CheckInRepository
	userRepo             UserRepository
	billingCacheService  *BillingCacheService
	authCacheInvalidator APIKeyAuthCacheInvalidator
	entClient            *dbent.Client
	cfg                  *config.Config
}

// NewCheckInService 创建签到服务
func NewCheckInService(
	checkInRepo CheckInRepository,
	userRepo UserRepository,
	billingCacheService *BillingCacheService,
	entClient *dbent.Client,
	authCacheInvalidator APIKeyAuthCacheInvalidator,
	cfg *config.Config,
) *CheckInService {
	return &CheckInService{
		checkInRepo:          checkInRepo,
		userRepo:             userRepo,
		billingCacheService:  billingCacheService,
		authCacheInvalidator: authCacheInvalidator,
		entClient:            entClient,
		cfg:                  cfg,
	}
}

func (s *CheckInService) checkInLocation() *time.Location {
	tz := strings.TrimSpace(s.cfg.Timezone)
	if tz == "" {
		tz = "Asia/Shanghai"
	}
	loc, err := time.LoadLocation(tz)
	if err != nil || loc == nil {
		return time.UTC
	}
	return loc
}

func normalizeCheckInDate(t time.Time) time.Time {
	y, m, d := t.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, t.Location())
}

func (s *CheckInService) todayDate() time.Time {
	now := time.Now().In(s.checkInLocation())
	return normalizeCheckInDate(now)
}

func (s *CheckInService) yesterdayDate(today time.Time) time.Time {
	return today.AddDate(0, 0, -1)
}

func calculateNextStreak(last *UserCheckIn, today time.Time) int {
	if last == nil {
		return 1
	}
	lastDate := normalizeCheckInDate(last.CheckInDate.In(today.Location()))
	yesterday := today.AddDate(0, 0, -1)
	if lastDate.Equal(yesterday) {
		next := last.StreakDay + 1
		if next > CheckInMilestone16 {
			next = 1
		}
		return next
	}
	return 1
}

func calculateCheckInRewards(streak int) (daily, bonus float64, milestone string) {
	switch streak {
	case CheckInMilestone4:
		daily = CheckInDailyReward
		bonus = CheckInDay4Total - CheckInDailyReward
		milestone = "day4"
	case CheckInMilestone16:
		daily = 0
		bonus = CheckInDay16Total
		milestone = "day16"
	default:
		daily = CheckInDailyReward
	}
	return daily, bonus, milestone
}

func parseCalendarMonth(raw string, loc *time.Location) (time.Time, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		now := time.Now().In(loc)
		return time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, loc), nil
	}
	parsed, err := time.ParseInLocation("2006-01", raw, loc)
	if err != nil {
		return time.Time{}, infraerrors.BadRequest("INVALID_CALENDAR_MONTH", "calendar month must be YYYY-MM")
	}
	return time.Date(parsed.Year(), parsed.Month(), 1, 0, 0, 0, 0, loc), nil
}

func nextMilestone(streak int, checkedInToday bool) int {
	current := streak
	if !checkedInToday {
		current++
	}
	switch {
	case current <= CheckInMilestone4:
		return CheckInMilestone4
	case current <= CheckInMilestone16:
		return CheckInMilestone16
	default:
		return CheckInMilestone16
	}
}

// GetStatus 获取当前签到状态
func (s *CheckInService) GetStatus(ctx context.Context, userID int64, calendarMonth string) (*CheckInStatus, error) {
	loc := s.checkInLocation()
	monthStart, err := parseCalendarMonth(calendarMonth, loc)
	if err != nil {
		return nil, err
	}

	today := s.todayDate()
	todayRecord, err := s.checkInRepo.GetByUserAndDate(ctx, userID, today)
	if err != nil {
		return nil, fmt.Errorf("get today check-in: %w", err)
	}

	last, err := s.checkInRepo.GetLatestByUser(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get latest check-in: %w", err)
	}

	var streak int
	if todayRecord != nil {
		streak = todayRecord.StreakDay
	} else if last != nil {
		lastDate := normalizeCheckInDate(last.CheckInDate.In(today.Location()))
		if lastDate.Equal(s.yesterdayDate(today)) {
			streak = last.StreakDay
		}
	}

	monthCheckIns, err := s.checkInRepo.ListByUserInMonth(ctx, userID, monthStart.Year(), monthStart.Month())
	if err != nil {
		return nil, fmt.Errorf("list month check-ins: %w", err)
	}

	status := &CheckInStatus{
		CheckedInToday: todayRecord != nil,
		Streak:         streak,
		NextMilestone:  nextMilestone(streak, todayRecord != nil),
		CalendarMonth:  monthStart.Format("2006-01"),
		MonthCheckIns:  monthCheckIns,
	}

	if todayRecord == nil {
		nextStreak := calculateNextStreak(last, today)
		daily, bonus, milestone := calculateCheckInRewards(nextStreak)
		status.TodayReward = &CheckInRewardPreview{
			DailyReward: daily,
			BonusReward: bonus,
			TotalReward: daily + bonus,
			Milestone:   milestone,
		}
	}

	return status, nil
}

// CheckIn 执行签到
func (s *CheckInService) CheckIn(ctx context.Context, userID int64) (*CheckInResult, error) {
	today := s.todayDate()

	existing, err := s.checkInRepo.GetByUserAndDate(ctx, userID, today)
	if err != nil {
		return nil, fmt.Errorf("get today check-in: %w", err)
	}
	if existing != nil {
		return nil, ErrCheckInAlreadyDone
	}

	last, err := s.checkInRepo.GetLatestByUser(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get latest check-in: %w", err)
	}

	streak := calculateNextStreak(last, today)
	daily, bonus, milestone := calculateCheckInRewards(streak)
	total := daily + bonus

	tx, err := s.entClient.Tx(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin transaction: %w", err)
	}
	defer func() { _ = tx.Rollback() }()

	txCtx := dbent.NewTxContext(ctx, tx)

	if err := s.userRepo.UpdateBalance(txCtx, userID, total); err != nil {
		return nil, fmt.Errorf("update user balance: %w", err)
	}

	record := &UserCheckIn{
		UserID:      userID,
		CheckInDate: today,
		StreakDay:   streak,
		DailyReward: daily,
		BonusReward: bonus,
		TotalReward: total,
		CreatedAt:   time.Now(),
	}
	if err := s.checkInRepo.Create(txCtx, record); err != nil {
		return nil, fmt.Errorf("create check-in record: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, fmt.Errorf("commit transaction: %w", err)
	}

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get user after check-in: %w", err)
	}

	s.invalidateCheckInCaches(ctx, userID, total)

	return &CheckInResult{
		Message:     "check-in successful",
		DailyReward: daily,
		BonusReward: bonus,
		TotalReward: total,
		Streak:      streak,
		NewBalance:  user.Balance,
		Milestone:   milestone,
		CheckInDate: today,
	}, nil
}

func (s *CheckInService) invalidateCheckInCaches(ctx context.Context, userID int64, amount float64) {
	if amount != 0 && s.authCacheInvalidator != nil {
		s.authCacheInvalidator.InvalidateAuthCacheByUserID(ctx, userID)
	}
	if s.billingCacheService != nil {
		go func() {
			cacheCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			_ = s.billingCacheService.InvalidateUserBalance(cacheCtx, userID)
		}()
	}
}
