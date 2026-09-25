# Legend Barber

Legend Barber is a booking website for a barbershop at 18 Rivonia Lane, Sandton. This repository is the local development foundation: a React frontend and a Laravel REST API in one repo. The public site, booking flow, and admin dashboard are not built yet.

## Structure

```text
/
  apps/
    web/          React frontend
    api/          Laravel REST API
  docs/           Product and implementation notes
  .github/
    workflows/    Test workflow
```

Node dependencies live in `apps/web`. PHP dependencies live in `apps/api`. There is no shared package workspace.

## Prerequisites

- Node.js 20 or newer
- PHP 8.3 or newer, with the `curl`, `mbstring`, `openssl`, `pdo_mysql`, `tokenizer`, `xml`, and `zip` extensions
- Composer 2
- MySQL 8

## Frontend

```bash
cd apps/web
cp .env.example .env
npm install
npm run dev
```

The app runs at http://localhost:5173. `VITE_API_BASE_URL` defaults to `http://localhost:8000`. On the home page, a development-only line shows whether `GET /api/health` succeeded. If the API is down or returns an unexpected payload, the page stays usable and shows `API unavailable`.

## API

```bash
cd apps/api
cp .env.example .env
composer install
php artisan key:generate
php artisan serve
```

The API runs at http://localhost:8000. `GET /api/health` returns:

```json
{ "status": "ok", "service": "legend-barber-api" }
```

Set `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` in `apps/api/.env` to a local MySQL account. Set `ADMIN_PASSWORD` to the single admin password. Do not commit that value. Session, cache, and queue drivers are files or `sync`, so the health check does not need MySQL.

The API uses `Africa/Johannesburg` for shop hours and booking times. CORS allows credentialed requests only from `FRONTEND_URL`. Sanctum treats `SANCTUM_STATEFUL_DOMAINS` as the React origin for the admin cookie session.

Create the database before the first migration:

```sql
CREATE DATABASE legend_barber CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations and seed the six services:

```bash
cd apps/api
php artisan migrate
php artisan db:seed
```

The Laravel skeleton already includes migrations for the framework `users`, `cache`, and `jobs` tables. Admin login does not use that users table. Booking availability is enforced again inside a transaction, and a unique index on `booking_date` plus `start_time` is the last line of defence when two requests arrive together. A booking queue was rejected because one chair and one slot do not need background jobs.

## Tests

```bash
cd apps/web
npm run lint
npm test
```

```bash
cd apps/api
php artisan test
```

API tests use an in-memory SQLite database from `phpunit.xml`, so they do not need MySQL. The application environment still uses MySQL. Running the suite against a real MySQL server was rejected because every future test run, including GitHub Actions, would then depend on a database service for checks that do not need one.

GitHub Actions installs and tests both apps on push and pull request.

## Deployment

Deployment is out of scope for this setup. Do not add hosting configuration until the application is ready to ship.
