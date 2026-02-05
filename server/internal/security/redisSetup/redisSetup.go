package redisSetup

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	BaseCtx = context.TODO()
	RDB     *redis.Client

	// Atomic INCR + EXPIRE (rate-limit / OTP window safe)
	IncrScript = redis.NewScript(`
		local current = redis.call("INCR", KEYS[1])
		if current == 1 then
			redis.call("EXPIRE", KEYS[1], ARGV[1])
		end
		return current
	`)
)

// Per-request context
func Ctx() (context.Context, context.CancelFunc) {
	return context.WithTimeout(BaseCtx, 2*time.Second)
}

// Initialize Redis
func InitRedis() {
	RDB = redis.NewClient(&redis.Options{
		Addr:         os.Getenv("REDIS_ADDR"),
		Password:     os.Getenv("REDIS_PASSWORD"),
		DB:           0,

		// Pool tuning
		PoolSize:     100,
		MinIdleConns: 20,

		// Reliability
		MaxRetries:   3,
		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
		PoolTimeout:  4 * time.Second,
	})

	ctx, cancel := Ctx()
	defer cancel()

	if err := RDB.Ping(ctx).Err(); err != nil {
		log.Fatalf("Redis startup failed: %v", err)
	}

	// Preload Lua scripts
	if err := IncrScript.Load(ctx, RDB).Err(); err != nil {
		log.Fatalf("Redis script load failed: %v", err)
	}
}

// Graceful shutdown
func CloseRedis() {
	if RDB != nil {
		_ = RDB.Close()
	}
}