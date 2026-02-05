user -> order -> auth -> user   (**avoid cycle import**)

If packages start importing each other in a loop, Go will break.

To avoid this, follow this rule:

➜ Smaller domains can import bigger ones

But bigger domains should never import smaller ones.

good->  order   -> auth      | Bad->   auth     -> user
        user    -> auth      |         database -> order
        catalog -> database  |
        admin   -> auth      |

Comparison Table : b/w Diff type Architechture of go lang Handlers
                   | Standered(direct)|(Method → `gin.HandlerFunc`)||
| Feature          | Method Receivers | Factory Methods|| Globals        | Closures |
| Testability      | High             | High           || Poor           | High     |
| Readability      | **Highest**      | Medium         || High (initial) | Medium   |
| Scalability      | High             | **Highest**    || Low            | Medium   |
| State Management | Safe             | Safe           || Dangerous      | Safe     |
| Flexibility      | Medium           | **Excellent**  || Low            | High     |


server/
├── docker/
├── docs/
├── internal/
│   ├── admin/
│   │   ├── center/
│   │   │   ├── controllers/
│   │   │   │   └── centerControllers.go
│   │   │   ├── model/
│   │   │   │   └── centerSchema.go
│   │   │   └── routes/
│   │   │       └── centerRoutes.go
│   │   ├── delivery/            # (future)
│   │   └── employee/            # (future)
│   │
│   ├── appCatalog/
│   │   ├── appData/
│   │   │   └── sampleProducts.go
│   │   ├── controllers/
│   │   │   ├── appController/
│   │   │   │   └── appController.go
│   │   │   └── item/
│   │   │       ├── centerProductController.go
│   │   │       └── itemsControllers.go
│   │   ├── model/
│   │   │   ├── appSchema.go
│   │   │   └── itemSchema.go
│   │   └── route/
│   │       └── appRoute.go
│   │
│   ├── auth/
│   │   ├── adminAuth.go
│   │   ├── authOTP.go
│   │   └── userAuth.go
│   │
│   ├── database/
│   │   ├── cloudinary.go
│   │   ├── connectDB.go
│   │   ├── makeUnique.go
│   │   └── setupCollections.go
│   │
│   ├── order/
│   │   ├── controllers/
│   │   │   ├── cart/
│   │   │   │   └── cart.go
│   │   │   └── order/
│   │   │       ├── orderCreate.go
│   │   │       ├── orderRead.go
│   │   │       ├── orderUpdate.go
│   │   │       └── statusUpdate.go
│   │   ├── model/
│   │   │   └── orderSchema.go
│   │   └── route/
│   │       ├── cartRoutes/
│   │       │   └── cartRoutes.go
│   │       └── orderRoutes/
│   │           └── orderRoutes.go
│   │
│   ├── security/   <<< NEW (to avoid circular imports)
│   │   ├── model/
│   │   │   └── securitySchema.go
│   │   ├── middleware/
│   │   │   ├── rateLimiter.go
│   │   │   ├── ipThrottle.go
│   │   │   ├── deviceBlocker.go
│   │   │   └── authSecurity.go
│   │   └── service/
│   │       ├── otpLimiter.go
│   │       └── loginAttempt.go
│   │
│   └── user/
│       ├── controllers/
│       │   ├── adminControllers/
│       │   │   └── adminControllers.go
│       │   ├── userActivityControllers/
│       │   │   └── userRecords.go
│       │   └── userControllers/
│       │       ├── userEntry.go
│       │       └── userUpdate.go
│       ├── model/
│       │   ├── userActivity.go
│       │   └── userModel.go
│       └── route/
│           ├── adminRoutes/
│           │   └── adminRoutes.go
│           └── userRoutes.go
│
├── main/
│   ├── serverSetup.go
│   └── server.go
│
├── pkg/
├── test/
├── scripts/
│   └── Makefile
├── .gitignore
├── README.md
├── go.mod
├── go.sum
└── .env


Performance: Unmarshalling JSON in middleware (OTP history) is slightly heavy. If you have millions of users, consider using a Redis List (RPUSH and LTRIM) instead of a JSON string