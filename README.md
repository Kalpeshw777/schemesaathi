# SchemeSaathi (योजना साथी)

> **AI-Driven Concessional Loan Matching & Channel Partner Routing Platform for Scheduled Caste (SC) Entrepreneurs & Students**
>
> Built for **Smart India Hackathon** Problem Statement **SIH26092** (Ministry of Social Justice and Empowerment / MoSJE / NSFDC).

---

## Overview

Under Ministry of Social Justice and Empowerment (MoSJE) directives, Scheduled Caste beneficiaries with annual family income up to **₹5.00 Lakh** qualify for concessional credit assistance (**4%–9.5% p.a.**) across micro finance, general term loans, domestic higher education, overseas study, and green sanitation schemes.

Concessional loans are **never disbursed directly** by the ministry. Instead, they are routed through over 100+ Channel Partners:
- **State Channelizing Agencies (SCAs)** (e.g. MPBCDC, DSFDC, TAHDCO, UPSCFDC, Anuja Nigam, TSSCCDC)
- **Public Sector Banks (PSBs)** (e.g. SBI, PNB, Canara Bank, Bank of Baroda)
- **Regional Rural Banks (RRBs)** (e.g. Aryavart Bank, Maharashtra Gramin Bank)
- **NBFC-MFIs** (e.g. Annapurna Finance, Satin Creditcare, Fusion Microfinance)

**SchemeSaathi** solves the critical informational, financial planning, and physical accessibility bottlenecks for beneficiaries.

---

## Key Features

### 1. 🎯 Deterministic Scheme Recommender Wizard (`/recommend` & `/recommend/result`)
- **Multi-step 1-question-per-screen wizard** with large tap targets, intuitive icons, and touch-optimized input chips.
- **Strict Rule-Based Decision Engine**: Evaluates project cost, category, family income (validating $\le ₹5$ Lakh eligibility ceiling), education level, and gender (applying 0.5%–1% interest rebates for women).
- **Explainable Output**: Returns `{ scheme, eligibility, confidence, reasoning }` with full deterministic rationale.
- **Multilingual Plain-Language Explanation**: Leverages **Groq Llama 3.3 70B** to translate and explain the scheme simply in English, Hindi, and Marathi, with a built-in offline fallback.

### 2. 🧮 Financial Calculator & Moratorium Visualizer (`/calculator`)
- **Pure client-side reactive mathematics** (no server latency).
- Synchronized dual-bound sliders and numeric inputs for Loan Amount, Annual Interest Rate, Tenure, and Moratorium period.
- **Moratorium Timeline Graphic**: Visually demystifies the grace period (0–18 months) during which ₹0 principal EMI is charged.
- **Concessional Savings Meter**: Quantifies exact interest savings compared against typical private bank commercial interest rates (13.5% p.a.).
- **Amortization Breakdown**: Month-by-month and year-by-year principal, interest, and remaining balance schedule.

### 3. 🗺️ Geo-Spatial Channel Partner Locator (`/locator`)
- **Interactive Mapbox GL JS map** plotting authorized SCAs, PSBs, RRBs, and NBFC-MFIs across Indian states and districts.
- **Multi-Factor Institutional Ranking Formula**:
  $$\text{Score} = (0.50 \times \text{ProximityScore}) + (0.50 \times \text{HealthScore})$$
  *(Where Health Score is derived from low NPA % and active application sanction readiness).*
- **Color-Coded Status Pins**: Green (Healthy $\ge 80$), Amber (60–79), Red (Restricted / High NPA).
- **Low-Bandwidth Fallback**: Searchable, filterable directory rendered below the map that works even in poor internet environments.

### 4. 📄 Scheme-Specific Document Checklist & Print Docket (`/checklist`)
- Dynamic document list mapped to each scheme (Caste certificate, Income certificate $\le ₹5$L, DPR/Quotation, MSME Udyam, Admission letter, Bank passbook).
- **Interactive Readiness Meter**: Calculates percentage of documents ready.
- **Government Verification Docket Export**: Specialized `@media print` stylesheet formatted for immediate presentation at bank and SCA offices.

### 5. 🤖 Persistent AI Sahayak (Chat Widget)
- Bottom-sheet / floating assistant available across all pages.
- Powered by **Groq API** (`llama-3.3-70b-versatile`) with conversational context awareness.
- Instant, polite, multilingual guidance in **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)** with offline fallback.

### 6. 🌐 Universal Internationalization (i18n)
- Seamless trilingual switching in the header with `localStorage` persistence.
- Zero hardcoded English strings in components.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Components & Route Handlers) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS with accessible palette & print media rules |
| **State Management** | Zustand (`useWizardStore`) with local persistence |
| **Icons** | Lucide React |
| **Maps** | Mapbox GL JS with low-bandwidth fallback table |
| **AI / LLM** | Groq API (`llama-3.3-70b-versatile`) for natural language explanations |
| **Database** | PostgreSQL via Supabase JS Client with local seed fallback |
| **Internationalization** | Trilingual i18n Context (`en`, `hi`, `mr`) |

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure keys (the platform runs with rich local fallback data if keys are left blank):
- `GROQ_API_KEY`: Groq Cloud API key for Llama 3.3 AI explanations.
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox public token for WebGL map tiles.
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Postgres configuration.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## Database Schema (Postgres / Supabase)
Execute `supabase/schema.sql` in your Supabase SQL editor to create the `schemes`, `partners`, and `applications` tables with full Row Level Security (RLS) policies and indexes.

---

## License & Acknowledgements
Built for **Smart India Hackathon SIH26092** under the aegis of the **Ministry of Social Justice & Empowerment (MoSJE)** and National Scheduled Castes Finance & Development Corporation (NSFDC).
