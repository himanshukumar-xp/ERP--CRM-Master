# ERP CRM Master — Accounting, Invoicing & CRM

> **Suggested GitHub repo description:** ERP/CRM for invoicing, customers & payments — MERN stack (Node.js, Express, MongoDB, React) with Ant Design & Redux.
> **Suggested topics:** `erp` `crm` `invoicing` `mern-stack` `react` `nodejs` `express` `mongodb` `ant-design` `redux`

A full-stack **ERP / CRM** web app for small businesses: manage **customers, invoices, payments, taxes, payment modes**, generate **PDF documents** (invoice/quote/payment), and configure company **settings** — with JWT auth, dashboard stats, and multi-language support. Maintained at [himanshukumar-xp/ERP--CRM-Master](https://github.com/himanshukumar-xp/ERP--CRM-Master); based on [IDURAR ERP/CRM](https://github.com/idurar/idurar-erp-crm) (see **License & credits** below). Set up and verified to run on `localhost`.

> **Fork status:** This is a fully rebranded fork. The UI uses text-based **ERP CRM Master** branding instead of image logos, password-reset emails use the new name, upstream upgrade/contact links are removed, and internal setting keys use the `app_*` namespace. See **License & credits** for the full list of changes.

**Live locally:** Frontend → http://localhost:3000 · Backend API → http://localhost:8888/api · Login → `admin@admin.com` / `admin123`

---

## ✨ Features (verified in this codebase)

| Area | What works |
|---|---|
| 🔐 Auth | Login / logout, forget & reset password, JWT (`x-auth-token`), protected routes |
| 📊 Dashboard | Revenue / invoice / quote / payment stats, recent activity |
| 👥 Customers | Full CRUD, search, list, summary (`/customer`) |
| 🧾 Invoices | Full CRUD + record payment, statuses (`draft/pending/sent/...`), overdue tracking (`/invoice`) |
| 💳 Payments | Full CRUD linked to invoices & clients (`/payment`) |
| 🏷️ Taxes & Payment Modes | Auto-wired CRUD API (`/taxes/*`, `/paymentmode/*`); seed includes `Tax 0%` + `Default Payment` |
| 🖨️ PDF documents | Pug templates (`backend/src/pdf/`: invoice, offer, quote, payment) rendered via `html-pdf` |
| 🎨 Branding | Text-based “ERP CRM Master” wordmark, SVG favicon (`frontend/src/favicon.svg`), About page links to GitHub issues |
| ⚙️ Settings | Company/app settings incl. read/update by key (`app_*` namespace), currency & language config |
| 🌍 i18n | Locale packs under `backend/src/locale` & `frontend/src/locale` (default `en_us`) |

> **Known gaps in this snapshot:** `frontend/src/router/routes.jsx` still references `Quote`, `QuoteCreate`, `QuoteRead`, `QuoteUpdate`, `PaymentMode`, and `Taxes` without declaring/importing them, and there are no matching quote page components or `Quote` backend model. Because those elements are created when the router module loads, signing in currently fails with `ReferenceError: Quote is not defined` before the dashboard renders (login/forgot-password pages themselves work). Remove those route entries — or add the missing pages/model — to restore `/invoice`, `/customer`, `/payment`, and `/settings`. `html-pdf` (PhantomJS) is deprecated — PDF export may fail on newer Node/Windows; core CRUD is unaffected.

---

## 🧰 Tech stack

| Layer | Technology (pinned) |
|---|---|
| Backend | Node.js 20.9 · Express 4.18 · Mongoose 8.1 · JWT · `module-alias` (`@` → `src`) |
| Frontend | React 18.3 · Vite 5.4 · Ant Design 5.14 · Redux Toolkit 2.2 · React Router 6 · Axios |
| Database | MongoDB ≥ 6 (verified with 9.0.2), DB name `erp-crm-master` |
| PDF / mail | Pug + `html-pdf`; Resend mail hooks (optional `RESEND_API`/`OPENAI_API_KEY`) |

---

## 📁 Project structure

```
erp-crm-master/
├── backend/
│   ├── .env                      # DATABASE, JWT_SECRET, PORT=8888, ...
│   ├── package.json              # scripts: dev / start / setup / reset / migrate:branding
│   └── src/
│       ├── server.js             # entry: connects Mongo, listens on 8888
│       ├── app.js                # Express app, CORS, /api /download /public
│       ├── routes/
│       │   ├── coreRoutes/       # coreAuth (login...), coreApi (admin/setting...)
│       │   └── appRoutes/appApi.js  # auto CRUD per entity in models/appModels
│       ├── controllers/
│       │   ├── appControllers/   # client/invoice/payment (+ generic CRUD factory)
│       │   ├── coreControllers/  # adminAuth, admin, setting, setup
│       │   └── pdfController/    # generatePdf via Pug + html-pdf
│       ├── models/
│       │   ├── appModels/        # Client, Invoice, Payment, PaymentMode, Taxes
│       │   ├── coreModels/       # Admin, AdminPassword, Setting, Upload
│       │   └── utils/            # routesList auto-built from appModels files
│       ├── setup/                # setup.js (seed admin/settings/tax/paymentmode)
│       │                         # migrateBranding.js (one-time DB migration)
│       ├── middlewares/          # auth, settings, upload (local / DO Spaces)
│       ├── pdf/                  # Invoice.pug, Quote.pug, Offer.pug, Payment.pug
│       ├── emailTemplate/        # rebranded HTML email bodies
│       └── locale/               # backend translations
├── frontend/
│   ├── .env                      # VITE_FILE_BASE_URL, VITE_BACKEND_SERVER
│   ├── vite.config.js            # dev :3000, proxies /api → http://localhost:8888/
│   ├── package.json              # scripts: dev / build / preview / lint / dev:remote
│   └── src/
│       ├── RootApp.jsx           # chooses auth app vs MainApp
│       ├── apps/                 # MainApp.jsx (entry), ErpApp.jsx, Header/, Navigation/
│       ├── config/serverApiConfig.js  # API_BASE_URL (dev → localhost:8888/api/)
│       ├── router/               # AppRouter.jsx, AuthRouter.jsx, routes.jsx
│       ├── pages/                # Customer, Invoice/*, Payment/*, Settings, auth pages
│       ├── modules/              # InvoiceModule, PaymentModule, QuoteModule, Dashboard...
│       ├── forms/                # TaxForm, PaymentModeForm, ... (per entity)
│       ├── redux/                # store (crud/auth/settings slices)
│       ├── request/              # axios instance + auth header
│       ├── favicon.svg           # text-based “E” favicon
│       └── locale/               # frontend translations
├── LICENSE                       # GNU AGPL v3.0
└── README.md                     # this file
```

> **Note:** `PaymentMode.js` / `Taxes.js` were missing from the snapshot (setup scripts required them) and were added to match the seed data and `TaxForm`/`PaymentModeForm` fields.

> **Documentation cleanup:** the rebrand removed the upstream `INSTALLATION-INSTRUCTIONS.md`, `CONTRIBUTING.md`, `CODE-OF-CONDUCT.md`, `SECURITY.md`, `MAINTAINERS.md`, translated `doc/` files and `.github/` templates. This README is the main setup guide.

**How the auto-CRUD works:** every file in `backend/src/models/appModels/*.js` is scanned by `models/utils` → an entity route set (`/:entity/create|read|update|delete|search|list|summary...`) is mounted in `appApi.js`. So adding `Quote.js` there would instantly expose `/quote/*` endpoints (the matching UI pages/components would still need to be added).

---

## ✅ Prerequisites

- **Node.js ≥ 20.9** (`node -v`; `package.json` pins `20.9.0`, newer versions may print an `EBADENGINE` warning) and **npm ≥ 10.2.4**
- **MongoDB** running on `127.0.0.1:27017` (local service or Atlas — see `.env`)
- Ports free: **3000** (frontend), **8888** (backend), **27017** (mongo)

---

## 🚀 Quickstart (localhost)

```bash
# 1. Backend deps + env
cd backend
npm install
# .env must contain at least:
#   DATABASE=mongodb://127.0.0.1:27017/erp-crm-master
#   JWT_SECRET=<long random string>
#   NODE_ENV=development
#   PORT=8888
#   PUBLIC_SERVER_FILE=http://localhost:8888/

# 2. Seed demo data (admin + 54 settings + tax + payment mode)
npm run setup

# 3. Start backend (http://localhost:8888/api)
npm run dev        # or: node src/server.js

# 4. In a second terminal — frontend
cd ../frontend
npm install
npm run dev        # → http://localhost:3000
```

**Login:** `admin@admin.com` / `admin123` (role `owner`). The seeded admin display name is now `Admin` (previously `IDURAR`).

> Upgrading an existing installation with data in the older `idurar-erp-crm` database? See **Upgrading a pre-rebrand database** below.

**Windows one-liner for MongoDB** (what this machine used):

```powershell
winget install --source winget --id MongoDB.Server --silent --accept-package-agreements --accept-source-agreements
winget install --source winget --id MongoDB.Shell  --silent --accept-package-agreements --accept-source-agreements
New-Item -ItemType Directory -Force -Path C:\data\db
& "C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe" --install --serviceName MongoDB --dbpath "C:\data\db" --logpath "C:\data\mongod.log" --bind_ip 127.0.0.1 --port 27017
```

---

## 🔄 Upgrading a pre-rebrand database

Internal setting keys were renamed (`idurar_app_*` → `app_*`, other `idurar_*` keys lose the prefix), the seeded admin name changed from `IDURAR` to `Admin`, and the default database name is now `erp-crm-master`. If you already have data in the old `idurar-erp-crm` database, run the one-time migration — it copies all collections into the new database, renames the setting keys and admin name, and leaves the old database untouched as a backup:

```bash
cd backend
npm run migrate:branding      # or: node src/setup/migrateBranding.js
```

Then restart the backend (settings are cached in memory). If your legacy database uses a different name, set `OLD_DATABASE_NAME=<name>` before running the script. Fresh installs can skip this — `npm run setup` seeds the new keys directly.

---

## 🔧 Configuration

**`backend/.env`**

| Key | Required | Default / example |
|---|---|---|
| `DATABASE` | ✅ | `mongodb://127.0.0.1:27017/erp-crm-master` |
| `JWT_SECRET` | ✅ | random 64-hex string |
| `PORT` | – | `8888` |
| `NODE_ENV` | – | `development` |
| `PUBLIC_SERVER_FILE` | – | `http://localhost:8888/` (also used for password-reset links when the `base_url` setting is unset) |
| `RESEND_API` / `OPENAI_API_KEY` | – | optional (mail/AI features only) |
| `DO_SPACES_*` / `REGION` | – | optional (Spaces upload backend) |

**`frontend/.env`**

| Key | Notes |
|---|---|
| `VITE_FILE_BASE_URL` | `http://localhost:8888/` — used to resolve uploaded files/photos |
| `VITE_BACKEND_SERVER` | `http://localhost:8888/` (used for remote/prod builds and `dev:remote`) |
| `VITE_WEBSITE_URL` | optional public site URL; falls back to `VITE_BACKEND_SERVER` in production |
| `VITE_DEV_REMOTE` | set to `remote` (or run `npm run dev:remote`) to proxy `/api` to `VITE_BACKEND_SERVER` instead of localhost |

> ⚠️ In local development leave `VITE_DEV_REMOTE` unset so the app uses `http://localhost:8888/api/`. `import.meta.env.PROD` is controlled by Vite's build mode, not by a `PROD` entry in `.env`.

**npm scripts**

| Where | Command | Purpose |
|---|---|---|
| backend | `npm run dev` | nodemon `src/server.js` |
| backend | `npm start` | `node src/server.js` |
| backend | `npm run setup` | seed admin + 54 settings + tax + payment modes |
| backend | `npm run reset` | wipe those collections |
| backend | `npm run migrate:branding` | one-time migration from the pre-rebrand database |
| frontend | `npm run dev` | Vite dev on `:3000` |
| frontend | `npm run dev:remote` | dev server proxying to `VITE_BACKEND_SERVER` |
| frontend | `npm run build` / `preview` | production build / preview |
| frontend | `npm run lint` | ESLint over `js/jsx` |

---

## 🔌 API overview

Base URL (dev): `http://localhost:8888/api` — auth via `x-auth-token: <JWT>`.

```
POST /api/login                        { email, password } → { token, ... }
POST /api/logout                       (auth)
POST /api/forgetpassword | resetpassword

# Core (auth) — admin & settings
GET|PATCH /api/admin/...               profile, password-update
GET|POST|PATCH /api/setting/...        incl. /setting/readBySettingKey/:key
                                       keys are namespaced app_* (e.g. app_language)

# App entities (auth) — client, invoice, payment, paymentmode, taxes
POST   /api/:entity/create
GET    /api/:entity/read/:id | list | listAll | search | filter | summary
PATCH  /api/:entity/update/:id
DELETE /api/:entity/delete/:id
POST   /api/invoice/mail | /api/payment/mail
GET    /api/quote/convert/:id          (requires Quote model — not in snapshot)
```

Smoke test (PowerShell):

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8888/api/login -Method Post `
  -ContentType "application/json" -Body '{"email":"admin@admin.com","password":"admin123"}'
```

---

## 🩺 Troubleshooting

| Symptom | Cause → Fix |
|---|---|
| `MongooseServerSelectionError: ECONNREFUSED 127.0.0.1:27017` + backend exits | MongoDB not running → start `MongoDB` service / `mongod --dbpath ...` |
| `EADDRINUSE :::8888` | stale node holding 8888 → kill it, keep one backend instance |
| Login page works, then blank screen / `ReferenceError: Quote is not defined` after sign-in | `routes.jsx` builds missing `Quote*`, `PaymentMode`, `Taxes` elements (known gap) → remove those route entries or add the pages/model; `/invoice`, `/customer`, `/payment`, `/settings` routes are otherwise complete |
| `GET /api/quote/*` returns 404 | no `Quote` backend model in this snapshot → add `backend/src/models/appModels/Quote.js` (auto-CRUD wires it) |
| `Cannot find module '../models/appModels/PaymentMode'` | fixed by added model files; re-seed taxes/paymentmodes if DB predates the fix |
| Settings look empty after upgrading (language, date format, emails) | setting keys not migrated → run `npm run migrate:branding` (or re-seed) and restart the backend |
| `npm run upgrade` fails (`Cannot find module .../src/setup/upgrade.js`) | script remains from upstream but the file was not included → use `npm run setup` (fresh DB) or `npm run migrate:branding` (existing DB) |
| PDF export errors (`html-pdf`/PhantomJS) | deprecated dependency; fails on Node ≥ 20/Win — CRUD unaffected, migrate to Puppeteer for PDFs |
| `npm warn EBADENGINE ... required node 20.9.0` | harmless warning on newer Node versions; frontend build verified on Node 24.22 |

---

## 📜 License & credits

- License: **GNU Affero General Public License v3.0** (see [`LICENSE`](LICENSE)).
- Based on [IDURAR ERP/CRM](https://github.com/idurar/idurar-erp-crm) by Salah Eddine Lalami, licensed under AGPL-3.0. This repository is a modified fork, released under the same AGPL-3.0 license.
- Rebranding changes in this fork: text-based **ERP CRM Master** navigation/auth branding instead of image logos, a new `frontend/src/favicon.svg`, rebranded page titles and email templates, removal of the upstream upgrade button and IDURAR contact/website links, renamed setting keys (`idurar_app_*` → `app_*`; other `idurar_*` keys drop the prefix), default database renamed to `erp-crm-master`, and removal of upstream docs/templates/workflows. The `PaymentMode`/`Taxes` models and local setup fixes are documented above.
