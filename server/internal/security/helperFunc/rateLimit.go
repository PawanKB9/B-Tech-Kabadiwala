package securityhelpers

import (
	"fmt"
	"time"

	redisSetup "github.com/PawanKB9/BTechKabadiwala/internal/security/redisSetup"
)

const (
	generalLimit = 120
	orderLimit   = 30
	cartLimit    = 60

	userWindow = 1 * time.Minute
)

func CheckUserRateLimit(userID, ip, routeClass string) (bool, time.Duration) {
	limit := generalLimit
	switch routeClass {
	case "order":
		limit = orderLimit
	case "cart":
		limit = cartLimit
	}

	key := fmt.Sprintf("user:rate:%s:%s:%s", userID, ip, routeClass)

	ctx, cancel := redisSetup.Ctx()
	defer cancel()

	count, err := redisSetup.IncrScript.Run(
		ctx,
		redisSetup.RDB,
		[]string{key},
		int(userWindow.Seconds()),
	).Int64()

	if err != nil {
		return false, 0
	}

	if count > int64(limit) {
		ttl, _ := redisSetup.RDB.TTL(ctx, key).Result()
		return true, ttl
	}

	return false, 0
}
