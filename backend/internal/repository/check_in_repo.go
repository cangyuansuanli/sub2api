package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	dbent "github.com/Wei-Shaw/sub2api/ent"
	"github.com/Wei-Shaw/sub2api/internal/service"
)

type checkInRepository struct {
	client *dbent.Client
}

func NewCheckInRepository(client *dbent.Client) service.CheckInRepository {
	return &checkInRepository{client: client}
}

func (r *checkInRepository) GetLatestByUser(ctx context.Context, userID int64) (*service.UserCheckIn, error) {
	client := clientFromContext(ctx, r.client)
	rows, err := client.QueryContext(ctx, `
SELECT id, user_id, check_in_date, streak_day, daily_reward, bonus_reward, total_reward, created_at
FROM user_check_ins
WHERE user_id = $1
ORDER BY check_in_date DESC, id DESC
LIMIT 1
`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		if err := rows.Err(); err != nil {
			return nil, err
		}
		return nil, nil
	}

	return scanUserCheckIn(rows)
}

func (r *checkInRepository) GetByUserAndDate(ctx context.Context, userID int64, date time.Time) (*service.UserCheckIn, error) {
	client := clientFromContext(ctx, r.client)
	rows, err := client.QueryContext(ctx, `
SELECT id, user_id, check_in_date, streak_day, daily_reward, bonus_reward, total_reward, created_at
FROM user_check_ins
WHERE user_id = $1 AND check_in_date = $2
LIMIT 1
`, userID, date.Format("2006-01-02"))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		if err := rows.Err(); err != nil {
			return nil, err
		}
		return nil, nil
	}

	return scanUserCheckIn(rows)
}

func (r *checkInRepository) Create(ctx context.Context, record *service.UserCheckIn) error {
	client := clientFromContext(ctx, r.client)
	rows, err := client.QueryContext(ctx, `
INSERT INTO user_check_ins (user_id, check_in_date, streak_day, daily_reward, bonus_reward, total_reward, created_at)
VALUES ($1, $2, $3, $4, $5, $6, NOW())
RETURNING id, created_at
`, record.UserID, record.CheckInDate.Format("2006-01-02"), record.StreakDay, record.DailyReward, record.BonusReward, record.TotalReward)
	if err != nil {
		return err
	}
	defer rows.Close()

	if !rows.Next() {
		return errors.New("insert check-in record returned no row")
	}
	if err := rows.Scan(&record.ID, &record.CreatedAt); err != nil {
		return err
	}
	return rows.Err()
}

func (r *checkInRepository) ListByUserInMonth(ctx context.Context, userID int64, year int, month time.Month) ([]service.UserCheckIn, error) {
	start := time.Date(year, month, 1, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 1, 0)

	client := clientFromContext(ctx, r.client)
	rows, err := client.QueryContext(ctx, `
SELECT id, user_id, check_in_date, streak_day, daily_reward, bonus_reward, total_reward, created_at
FROM user_check_ins
WHERE user_id = $1
  AND check_in_date >= $2
  AND check_in_date < $3
ORDER BY check_in_date ASC, id ASC
`, userID, start.Format("2006-01-02"), end.Format("2006-01-02"))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]service.UserCheckIn, 0, 31)
	for rows.Next() {
		item, err := scanUserCheckIn(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *item)
	}
	return out, rows.Err()
}

func scanUserCheckIn(rows *sql.Rows) (*service.UserCheckIn, error) {
	var item service.UserCheckIn
	var checkInDate time.Time
	if err := rows.Scan(
		&item.ID,
		&item.UserID,
		&checkInDate,
		&item.StreakDay,
		&item.DailyReward,
		&item.BonusReward,
		&item.TotalReward,
		&item.CreatedAt,
	); err != nil {
		return nil, fmt.Errorf("scan check-in row: %w", err)
	}
	item.CheckInDate = checkInDate
	return &item, nil
}
