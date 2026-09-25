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
    workflows/    Test and GitHub Pages workflows
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

Set `DB_USERNAME` and `DB_PASSWORD` in `apps/api/.env` to a local MySQL account. Session, cache, and queue drivers are files or `sync`, so the health check does not need MySQL.

Create the database before the first migration:

```sql
CREATE DATABASE legend_barber CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations when you are ready to create tables:

```bash
cd apps/api
php artisan migrate
```

The Laravel skeleton already includes migrations for the framework `users`, `cache`, and `jobs` tables. Booking tables are not included yet.

CORS allows the local frontend origin `http://localhost:5173` through `FRONTEND_URL`.

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

The frontend publishes to GitHub Pages from `main`. After the first successful deploy, the site is at [https://sabisa-siganga.github.io/legend-barber/](https://sabisa-siganga.github.io/legend-barber/).

One-time repository setting: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow cannot publish until that source is selected.

`.github/workflows/deploy-web.yml` runs when `apps/web` changes on `main`, or when you start it manually. It installs dependencies, lints, tests, and builds with `VITE_BASE_PATH` set to `/legend-barber/` (the repository name). Local `npm run dev` and `npm run build` leave that variable unset, so they keep serving from `/`.

GitHub Pages has no rewrite rule for client routes. After the build, the workflow copies `dist/index.html` to `dist/404.html`. A direct visit to `/services` receives that shell, and React Router renders the route. The HTTP status for those direct visits stays 404.

The API is not deployed with the site. Production builds omit the development API status line.

A custom domain on this project site is served from `/`, not `/legend-barber/`. If you add one, change `VITE_BASE_PATH` in the workflow to `/`.

The workflow uses GitHub's Pages artifact actions instead of committing a `gh-pages` branch. A branch deploy would need a contents-write token and would store build output in git. The artifact stays out of the repository. Hash URLs were rejected because they would change every public path; the 404 shell keeps the existing `BrowserRouter` paths.
