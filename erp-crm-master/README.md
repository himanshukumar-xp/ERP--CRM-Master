# ERP CRM Master — Open Source Invoice, Customer & Payment Management

> **Suggested GitHub repo description:** Open-source ERP/CRM for invoicing, customers & payments — MERN stack (Node.js, Express, MongoDB, React) with Ant Design & Redux.
> **Suggested topics:** `erp` `crm` `invoicing` `mern-stack` `react` `nodejs` `express` `mongodb` `ant-design` `redux` `open-source`

A full-stack **ERP / CRM** web app for small businesses: manage **customers, invoices, payments, taxes, payment modes**, generate **PDF documents** (invoice/quote/payment), and configure company **settings** — with JWT auth, dashboard stats, and multi-language support. Forked from the IDURAR open-source project (v4.1.0) into [himanshukumar-xp/ERP--CRM-Master](https://github.com/himanshukumar-xp/ERP--CRM-Master), set up and verified to run on `localhost`.

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
| ⚙️ Settings | Company/app settings incl. read/update by key, currency & language config |
| 🌍 i18n | Locale packs under `backend/src/locale` & `frontend/src/locale` (default `en_us`) |

> **Known gaps in this snapshot:** `frontend/src/router/routes.jsx` references `<Quote/>`, `<PaymentMode/>`, `<Taxes/>` without lazy imports, and there is no `Quote` backend model — so `/quote`, `/taxes`, `/payment/mode` UI routes fail while `/invoice`, `/customer`, `/payment`, `/settings` work fully. `html-pdf` (PhantomJS) is deprecated upstream — PDF export may fail on newer Node/Windows; core CRUD is unaffected.

---

## 🧰 Tech stack

| Layer | Technology (pinned) |
|---|---|
| Backend | Node.js ≥ 20 · Express 4.18 · Mongoose 8.1 · JWT · `module-alias` (`@` → `src`) |
| Frontend | React 18.3 · Vite 5.4 · Ant Design 5.14 · Redux Toolkit 2.2 · React Router 6 · Axios |
| Database | MongoDB ≥ 6 (verified with 9.0.2), DB name `idurar-erp-crm` |
| PDF / mail | Pug + `html-pdf`, Nodemailer-style mail hooks, Resend/OpenAI keys optional |

---

## 📁 Project structure

```
erp-crm-master/
├── backend/
│   ├── .env                      # DATABASE, JWT_SECRET, PORT=8888, ...
│   ├── package.json              # scripts: dev / start / setup / reset
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
│       │   ├── appModels/        # Client, Invoice, Payment, PaymentMode*, Taxes*
│       │   ├── coreModels/       # Admin, AdminPassword, Setting, Upload
│       │   └── utils/            # routesList auto-built from appModels files
│       ├── setup/                # setup.js (seed admin/settings/tax/paymentmode)
│       ├── middlewares/          # auth, settings, upload (local / DO Spaces)
│       ├── pdf/                  # invoice.pug, quote.pug, offer.pug, payment.pug
│       └── locale/               # backend translations
├── frontend/
│   ├── .env                      # VITE_FILE_BASE_URL, VITE_BACKEND_SERVER
│   ├── vite.config.js            # dev :3000, proxies /api → http://localhost:8888/
│   ├── package.json              # scripts: dev / build / preview
│   └── src/
│       ├── config/serverApiConfig.js  # API_BASE_URL (dev → localhost:8888/api/)
│       ├── router/routes.jsx     # /invoice /customer /payment /settings /profile ...
│       ├── pages/                # Customer, Invoice/*, Payment/*, Settings, Login...
│       ├── modules/              # InvoiceModule, PaymentModule, QuoteModule, Dashboard...
│       ├── forms/                # TaxForm, PaymentModeForm, ... (per entity)
│       ├── redux/                # store (crud/auth/settings slices)
│       ├── request/              # axios instance + auth header
│       └── locale/               # frontend translations
├── INSTALLATION-INSTRUCTIONS.md  # upstream generic guide
├── LICENSE                       # GNU AGPL v3.0
└── README.md                       # this file
```

> \* `PaymentMode.js` / `Taxes.js` were missing from the snapshot (setup scripts required them) and were added to match the seed data and `TaxForm`/`PaymentModeForm` fields.

**How the auto-CRUD works:** every file in `backend/src/models/appModels/*.js` is scanned by `models/utils` → an entity route set (`/:entity/create|read|update|delete|search|list|summary...`) is mounted in `appApi.js`. So adding `Quote.js` there would instantly expose `/quote/*` endpoints.

---

## ✅ Prerequisites

- **Node.js ≥ 20** (`node -v`) and npm 10+
- **MongoDB** running on `127.0.0.1:27017` (local service or Atlas — see `.env`)
- Ports free: **3000** (frontend), **8888** (backend), **27017** (mongo)

---

## 🚀 Quickstart (localhost)

```bash
# 1. Backend deps + env
cd backend
npm install
# .env must contain at least:
#   DATABASE=mongodb://127.0.0.1:27017/idurar-erp-crm
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

**Login:** `admin@admin.com` / `admin123` (role `owner`).

**Windows one-liner for MongoDB** (what this machine used):

```powershell
winget install --source winget --id MongoDB.Server --silent --accept-package-agreements --accept-source-agreements
winget install --source winget --id MongoDB.Shell  --silent --accept-package-agreements --accept-source-agreements
New-Item -ItemType Directory -Force -Path C:\data\db
& "C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe" --install --serviceName MongoDB --dbpath "C:\data\db" --logpath "C:\data\mongod.log" --bind_ip 127.0.0.1 --port 27017
```

---

## 🔧 Configuration

**`backend/.env`**

| Key | Required | Default / example |
|---|---|---|
| `DATABASE` | ✅ | `mongodb://127.0.0.1:27017/idurar-erp-crm` |
| `JWT_SECRET` | ✅ | random 64-hex string |
| `PORT` | – | `8888` |
| `NODE_ENV` | – | `development` |
| `PUBLIC_SERVER_FILE` | – | `http://localhost:8888/` |
| `RESEND_API` / `OPENAI_API_KEY` | – | optional (mail/AI features only) |
| `DO_SPACES_*` / `REGION` | – | optional (Spaces upload backend) |

**`frontend/.env`**

| Key | Notes |
|---|---|
| `VITE_FILE_BASE_URL` | `http://localhost:8888/` |
| `VITE_BACKEND_SERVER` | `http://localhost:8888/` (used for remote/prod builds) |

> ⚠️ Do **not** set `PROD=false` in `frontend/.env` — Vite exposes it as the truthy string `"false"`, which flips `serverApiConfig.js` into remote-backend mode. In local dev leave `PROD` unset so the app uses `http://localhost:8888/api/`.

**npm scripts**

| Where | Command | Purpose |
|---|---|---|
| backend | `npm run dev` | nodemon `src/server.js` |
| backend | `npm start` | `node src/server.js` |
| backend | `npm run setup` | seed admin + settings + taxes + payment modes |
| backend | `npm run reset` | wipe those collections |
| frontend | `npm run dev` | Vite dev on `:3000` |
| frontend | `npm run build` / `preview` | production build / preview |

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
| Frontend loads but login fails / API 404 on `/quote/*` | Quote model+page missing in snapshot (known gap); invoice/customer/payment work |
| `Cannot find module '../models/appModels/PaymentMode'` | fixed by added model files; re-seed taxes/paymentmodes if DB predates the fix |
| PDF export errors (`html-pdf`/PhantomJS) | deprecated upstream dep; fails on Node ≥ 20/Win — CRUD unaffected, migrate to Puppeteer for PDFs |
| `npm warn EBADENGINE ... required node 20.9.0, current v22` | harmless warning; verified working on Node 22 |

---

## 📜 License & credits

- License: **GNU Affero General Public License v3.0** (see `LICENSE`).
- This fork: [himanshukumar-xp/ERP--CRM-Master](https://github.com/himanshukumar-xp/ERP--CRM-Master) (upstream: [idurar/idurar-erp-crm](https://github.com/idurar/idurar-erp-crm) by IDURAR — MERN + Ant Design open-source ERP/CRM). Local fixes (`.env`, missing `PaymentMode`/`Taxes` models) are documented above.
- Contributing / conduct / security: see `CONTRIBUTING.md`, `CODE-OF-CONDUCT.md`, `SECURITY.md`.
