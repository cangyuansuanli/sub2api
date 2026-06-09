-- 用户每日签到记录
CREATE TABLE IF NOT EXISTS user_check_ins (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    streak_day INT NOT NULL DEFAULT 1,
    daily_reward DECIMAL(20,8) NOT NULL,
    bonus_reward DECIMAL(20,8) NOT NULL DEFAULT 0,
    total_reward DECIMAL(20,8) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, check_in_date)
);

CREATE INDEX IF NOT EXISTS idx_user_check_ins_user_id_created_at
    ON user_check_ins(user_id, created_at DESC);

COMMENT ON TABLE user_check_ins IS '用户每日签到记录';
COMMENT ON COLUMN user_check_ins.streak_day IS '本次签到时的连续天数';
COMMENT ON COLUMN user_check_ins.daily_reward IS '每日基础奖励（沧耳）';
COMMENT ON COLUMN user_check_ins.bonus_reward IS '连续签到里程碑额外奖励（沧耳）';
