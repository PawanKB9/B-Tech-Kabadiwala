## YAGNI Principle
    Do not optimize what is not needed yet

## MVP + Iteration Principle
    Build value first, optimize after validation

## Agile Reality
    Functionality → Stability → Performance

Coding at different phases...
Phase 1 — Stabilize Product    | Phase 2 — Optimize Rendering
    Fix UX pain                |     Decide SSR vs CSR
    Remove bugs                |      Client components vs server components
    Improve reliability        |      Lazy load heavy UI
                               |
Phase 3 — Performance          | Phase 4 — SEO
    Redis + CDN integration    |    Metadata
    Reduce API latency         |    Structured data
    Prefetch where required    |    Open graph
    Reduce JS bundle           |    Sitemap
                               |    Robots
Phase 5 — Production Polish    |    Content strategy
    Error boundaries           |
    Monitoring
    Analytics
    Logs
    Security tightening


# Frontend protection does not replace backend security.
Prevent accidental abuse
Reduce duplicate intent
Improve UX consistency
Reduce unnecessary backend load

## Backend enforces trust.
## Frontend enforces intent discipline.

1. Protect mutations, smooth queries
2. Guards read state, they don’t fetch
3. Disable beats debounce for writes
4. Backend enforces trust, frontend enforces intent
5. If it feels slow, you over-protected

# What NOT to Do (Common Mistakes)
1. Global debounce on all APIs
2. Artificial delays to “protect backend”
3. Frontend rate limiting as security
4. Multiple guards fighting each other
5. Blocking user without feedback

# Intent Categories (Think This Way First)
Every frontend API call falls into one of these categories:
| Category             | Description                                       |
| ---------------------| ------------------------------------------------- |
| Critical mutation    | Must execute once (orders, payments)              |
| User intent mutation | User clicks intentionally (login, update profile) |
| Exploratory reads    | User typing / browsing (search, filters)          |
| Continuous reads     | Triggered by scroll, resize, drag                 |
| Background reads     | App bootstrap, analytics                          |

# Frontend Intent Hygiene – Protection Strategy Matrix (Updated)
|Endpoint type     |Technique(s)                 |Purpose / Intent Control              |
|------------------|-----------------------------|--------------------------------------|
|Auth(login/signup)|Disable-on-flight            |Prevent double submit and rage clicks |
|Cart updates      |Disable + optimistic updates |Avoid duplicates while keeping UI fast|
|Order placement   |Disable + backend idempotency|Guarantee exactly-once intent         |
|Search            |Debounce                     |Reduce noisy requests during typing   |
|Address lookup    |Debounce + min input length  |Control cost and request volume       |
|Infinite scroll   |Throttle                     |Prevent request flooding on scroll    |
|Profile update    |Disable-on-flight            |Preserve data consistency             |
|Analytics         |Throttle / batch             |Reduce noise and control backend load |
|Auto-save         |Debounce + diff detection    |Minimize unnecessary writes           |
|Wishlist          |Optimistic update + rollback |Instant feedback with safety          |
|Filters (catalog) |Debounce + cache reuse       |Smooth UX without API spam            |
|Notifications poll|Throttle/interval-based fetch|Predictable, controlled polling       |

# Techniques (Examples)
## 4.1 Disable-on-flight (MOST IMPORTANT)
Use for: Login, signup, submit, update, place order
Rule: If a mutation is running → UI must not allow re-trigger
Example:
const [login, { isLoading }] = useLoginUserMutation()
<button disabled={isLoading}>
  {isLoading ? 'Logging in...' : 'Login'}
</button>
What it prevents: Double submit, Rage clicking, Duplicate backend writes

## 4.2 Optimistic Updates (Cart, Wishlist)
Use for: Cart add/remove, quantity update
Pattern: Update UI immediately, Roll back on failure, RTK Query supports this natively.
Fast UX, Fewer perceived delays, Reduced re-fetch pressure

## 4.3 Debounce (Input-driven APIs)
Use for: Search, Address autocomplete, Filters, Suggestions
Rule: Debounce reads, never critical writes
Example:
const debouncedSearch = debounce((q) => {
  triggerSearch(q)
}, 400)
### Anti-pattern ( Do Not use Debounce here)
❌ Debouncing login
❌ Debouncing order placement

## 4.4 Throttle (Continuous Events)
Use for: Infinite scroll, Scroll-based fetch, Map drag, Resize
Example:
const throttledLoadMore = throttle(loadMore, 1000)
Why: Scroll fires dozens of times per second, Backend does not need that frequency

## 4.5 RTK Query Cache & Deduplication (Free Protection)
RTK Query automatically: Deduplicates identical requests, Shares cache across components,
Cancels stale requests
Rule: Prefer RTK Query over manual fetch, This alone prevents many accidental floods.

## 4.6 Abort Previous Requests (Search)
RTK Query cancels outdated queries automatically.
Pattern:
useSearchQuery(query, {
  skip: query.length < 2,
})
Old requests are aborted when query changes.

## 4.7 Intent Lock (Critical Actions)
Use for: Payment, Final order confirmation
Example:
let locked = false
const placeOrderSafe = async () => {
  if (locked) return
  locked = true
  await placeOrder()
  locked = false
}
Why: Guards against edge cases, Network retries, Double taps on mobile

## 4.8 Backend Idempotency (Frontend-Aware)
Frontend should: Disable submit, Send idempotency key (if supported)
Backend ensures: Same action → same result, This is mandatory for orders & payments.

# OTP Auth Flow
[1] User submits phone number
     ↓
[2] Backend eligibility check (**check eligibility/send OTP**)
     - rate limits
     - phone/IP heuristics
     ↓
[3] If suspicious → captcha_required = true
     ↓
[4] Frontend runs reCAPTCHA v3
     ↓
[5] Frontend sends captcha_token
     ↓
[6] Backend verifies captcha with Google (**check eligibility/send OTP**) same API
     ↓
[7] If passed → send OTP
     ↓
[8] OTP verification
     ↓
[9] Issue auth token
