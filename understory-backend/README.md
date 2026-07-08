# Understory backend (Spring Boot + JDBC + MySQL)

Stores shop accounts (username, hashed password) and each user's taste profile
(likes, cart, tag weights) in MySQL, via `JdbcTemplate` — no ORM, just SQL you
can read directly in `UserRepository.java`.

## 1. Configure the database

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/understory?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=understory_user
spring.datasource.password=changeme
```

Point it at your real MySQL host/db/credentials. `createDatabaseIfNotExist=true`
will create the `understory` schema if it's missing; the two tables
(`users`, `user_profiles`) are created automatically on startup from
`schema.sql`.

## 2. Run it

```bash
mvn spring-boot:run
```

It starts on `http://localhost:8080`.

## 3. API

| Method | Path                          | Body / Header                              | Notes |
|--------|-------------------------------|---------------------------------------------|-------|
| POST   | `/api/auth/signup`            | `{ "username": "...", "password": "..." }`  | 201, or 409 if taken |
| POST   | `/api/auth/login`             | `{ "username": "...", "password": "..." }`  | 200 with profile, or 401 |
| GET    | `/api/users/{username}/profile` | —                                          | `{ likes, cart, profile }` |
| PUT    | `/api/users/{username}/profile` | `{ likes, cart, profile }`                | upsert |
| GET    | `/api/admin/users`            | header `X-Admin-Passcode: understory-admin` | list of all users + profiles |

Passwords are hashed with BCrypt (`spring-security-crypto`) before storage —
never stored or returned in plaintext.

## 4. Point the frontend at it

See `understory-ai-shop.PATCHED.jsx` — it replaces the `window.storage`
persistence helpers with `fetch` calls to this API, and updates the admin
panel to send the passcode as a header instead of checking it client-side.
Change the `API_BASE` constant at the top if your backend isn't on
`http://localhost:8080`.
