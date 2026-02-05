package securityhelpers

import (
	"time"
)

// rules
const (
	maxOTP10Min  = 2
	maxOTP24Hour = 3
	block24Hour  = 24 * time.Hour
)

func CheckAndAppendOTP(
	timestamps []time.Time,
	now time.Time,
	) (updated []time.Time, blockedUntil *time.Time) {

	var last10Min []time.Time
	var last24Hour []time.Time

	for _, t := range timestamps {
		if now.Sub(t) <= 10*time.Minute {
			last10Min = append(last10Min, t)
		}
		if now.Sub(t) <= 24*time.Hour {
			last24Hour = append(last24Hour, t)
		}
	}

	if len(last10Min) >= maxOTP10Min || len(last24Hour) >= maxOTP24Hour {
		b := now.Add(block24Hour)
		return timestamps, &b
	}

	updated = append(last24Hour, now)
	return updated, nil
}

// NOT NEEDED FOR NOW:
// func CooldownRemaining(cooldownUntil, now time.Time) time.Duration {
// 	if cooldownUntil.IsZero() {
// 		return 0
// 	}

// 	if now.After(cooldownUntil) {
// 		return 0
// 	}

// 	return cooldownUntil.Sub(now)
// }

// func IsCooldownActive(cooldownUntil, now time.Time) bool {
// 	if cooldownUntil.IsZero() {
// 		return false
// 	}

// 	return now.Before(cooldownUntil.Add(-500 * time.Millisecond))
// }

// func NextCooldown(now time.Time, duration time.Duration) time.Time {
// 	return now.Add(duration)
// }
