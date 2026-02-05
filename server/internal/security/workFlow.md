┌─────────────────────────────────────────────────────────┐
| Threat              | Mitigation                        |
| ------------------- | --------------------------------- |
| Bot scraping        | IP throttling + header heuristics |
| Credential stuffing | User + IP + route rate limits     |
| OTP flooding        | Cooldown + sliding window limits  |
| SMS gateway abuse   | Daily OTP caps                    |
| Enumeration attacks | Risk-based CAPTCHA                |
| Distributed abuse   | Multi-dimensional Redis keys      |
└─────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────┐
│ Incoming HTTP Request                     │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ IPThrottleMiddleware                      │
│ - Global coarse throttling (IP-based)     │   
│ - Short block window (fail-open)          │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ HeaderValidationMiddleware                │
│ - Weak heuristic signals                  │
│ - NEVER blocks                            │
│ - Produces: risk_score                    │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ Authentication Middleware (external)      │
│ - Sets: userId, phone                     │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ UserRateLimitMiddleware                   │
│ - Per-user + IP + route class             │
│ - Produces: user_rate_exceeded            │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ OTPCooldownMiddleware (OTP routes only)   │
│ - Enforces resend cooldown                │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ OTPAbuseMiddleware (OTP routes only)      │
│ - Sliding window abuse detection          │
│ - Produces: otp_abuse, otp_count          │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ RiskMiddleware                            │
│ - Aggregates ALL signals                  │
│ - External suspicious-context checks      │
│ - Produces: risk_final                    │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ CaptchaTriggerMiddleware                  │
│ - Sensitive routes only                   │
│ - Invisible until threshold crossed       │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ GlobalRiskEnforcementMiddleware           │
│ - Final hard-block decision               │
│ - risk_final ≥ 7 → HTTP 403               │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ Business Logic / Controllers              │
└───────────────────────────────────────────┘


Security Controls

1. IP Throttling (Global)
Limit: 300 requests / minute / IP
Block Duration: 1 minute
Scope: Entire application
Fail Mode: Open (never blocks if Redis fails)
Purpose: absorb volumetric abuse without impacting real users.

2. Header Heuristics (Non-Blocking)
Evaluated signals:
Missing or short User-Agent
Missing Accept
Invalid Content-Type on write requests
These signals:
Increase risk score
Never directly block
Purpose: fingerprint automation without harming mobile SDKs.

3. User Rate Limiting
Rate limits are applied only after authentication.
Route Class	Limit
order	30/min
cart	60/min
general	120/min
Key dimensions:
userId + IP + routeClass
Purpose: prevent abuse using valid credentials.

4. OTP Protections
Cooldown
Enforces wait time between OTP sends
Prevents UI hammering
Abuse Detection
Max 2 OTPs / 10 minutes
Max 3 OTPs / 24 hours
24-hour hard block if exceeded
Purpose: protect SMS gateway and prevent brute force OTP guessing.

5. Risk Aggregation Engine
Risk signals and weights:
Signal	Weight
Header anomalies	1–2
OTP abuse	+3
User rate exceeded	+2
Suspicious context	+2
Suspicious context includes:
IP nearing rate limits
Recent IP blocks
High OTP frequency

6. CAPTCHA Enforcement
Applied only on sensitive routes
Triggered when risk_final ≥ 5
Invisible by default
No CAPTCHA shown to normal users
Purpose: stop automation without degrading UX.

7. Global Enforcement
Final decision:
risk_final ≥ 7 → HTTP 403
This ensures:
At least 3 independent indicators
No accidental lockouts