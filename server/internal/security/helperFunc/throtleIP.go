package securityhelpers

import (
	"fmt"
	"time"

	redisSetup "github.com/PawanKB9/BTechKabadiwala/internal/security/redisSetup"
	"github.com/redis/go-redis/v9"
)

const (
	ipRequestLimit = 300
	ipWindow       = 1 * time.Minute
	ipBlockTime    = 1 * time.Minute
)

func CheckIPThrottle(ip string) (blocked bool, retryAfter time.Duration, err error) {
	key := fmt.Sprintf("ip:rate:%s", ip)
	blockKey := fmt.Sprintf("ip:block:%s", ip)

	ctx, cancel := redisSetup.Ctx()
	defer cancel()

	// Check active block
	blockTTL, err := redisSetup.RDB.TTL(ctx, blockKey).Result()
	if err != nil && err != redis.Nil {
		return false, 0, nil
	}

	if blockTTL > 0 {
		return true, blockTTL, nil
	}

	// Atomic increment + expiry
	count, err := redisSetup.IncrScript.Run(
		ctx,
		redisSetup.RDB,
		[]string{key},
		int(ipWindow.Seconds()),
	).Int64()

	if err != nil {
		return false, 0, nil
	}

	if count > ipRequestLimit {
		_ = redisSetup.RDB.Set(ctx, blockKey, "1", ipBlockTime).Err()
		_ = redisSetup.RDB.Del(ctx, key).Err()

		ttl, _ := redisSetup.RDB.TTL(ctx, blockKey).Result()
		return true, ttl, nil
	}

	return false, 0, nil
}
