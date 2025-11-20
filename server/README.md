<!-- go run main.go -->



server2/
├── internal/
│   ├── routes
|   |   |── sellRoutes.go
|   |   |── tempMaliks.go
|   |   |── userRoutes.go
│   ├── middlewares/     ← Auth, logging, etc.
│   ├── services/        ← Business logic
│   ├── repositories/    ← Database layer
│   ├── models/          ← Structs, DTOs
│   └── config/          ← App configs
├── pkg/                 ← Shared libs (logger, utils, etc.)
├── test/                ← Integration/e2e tests
├── scripts/             ← Automation
│   └── Makefile
├── docs/                ← API specs, diagrams
├── Dockerfile
├── .gitignore
├── README.md
├── go.mod
├── go.sum
├── .env
|── main.go


├── internal/
│   ├── admin/
│   │   ├── handler.go
│   │   ├── service.go
│   │   ├── repository.go
│   │   ├── model.go
│   │   ├── routes.go
│   │   └── dto.go
│   │
│   ├── app/
│   │   ├── handler.go
│   │   ├── service.go
│   │   ├── repository.go
│   │   ├── model.go
│   │   ├── routes.go
│   │   └── dto.go
│   │
│   ├── user/
│   │   ├── handler.go
│   │   ├── service.go
│   │   ├── repository.go
│   │   ├── model.go
│   │   ├── routes.go
│   │   └── dto.go
│   │
│   ├── order/
│   │   ├── handler.go
│   │   ├── service.go
│   │   ├── repository.go
│   │   ├── model.go
│   │   ├── routes.go
│   │   └── dto.go
│   │
│   ├── streaming/
│   │   ├── handler.go
│   │   ├── service.go
│   │   ├── repository.go
│   │   ├── model.go
│   │   ├── routes.go
│   │   └── dto.go
│   │
│   ├── middleware/
│   │   ├── auth.go
│   │   ├── cors.go
│   │   └── logging.go
│   │
│   ├── config/
│   │   ├── config.go
│   │   ├── env.go
│   │   └── loader.go
│   │
│   ├── db/
│   │   ├── connect.go
│   │   ├── migrate/
│   │   │   ├── 001_init.sql
│   │   │   └── 002_add_orders.sql
│   │   └── seed/
│   │       └── seed_data.sql
│   │
│   ├── utils/
│   │   ├── logger.go
│   │   ├── response.go
│   │   ├── validation.go
│   │   └── constants.go
│   │
│   └── server/
│       ├── router.go
│       └── server.go    