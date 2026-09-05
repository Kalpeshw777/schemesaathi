# SchemeSaathi — Pitch & Architecture Notes (SIH26092)

> **Document Purpose**: Background notes for pitch evaluation explaining architectural choices, stateless prototype design, and enterprise production roadmap.

---

## 1. Why the Prototype is Intentionally Stateless (No Auth / No Database)

1. **Zero-Barrier Accessibility for Beneficiaries**:
   - Rural and semi-urban Scheduled Caste (SC) applicants frequently drop off when forced through multi-step account creation, passwords, or phone OTPs before knowing if they are even eligible.
   - SchemeSaathi prioritizes **instant, frictionless eligibility matching (< 1 millisecond)** using deterministic client-side evaluation so the user immediately gets scheme clarity and nearest branch information without any upfront sign-in barrier.

2. **Edge-Ready & Zero-Latency Performance**:
   - By structuring scheme rules, eligibility logic, and channel partner geocoding as optimized in-memory structures and deterministic micro-APIs, every action (scheme recommendation, EMI calculation, partner filtering) renders instantly even on low-bandwidth 2G/3G mobile networks.

3. **Privacy & Data Minimization by Design**:
   - No sensitive personal identifiable information (PII), Aadhaar numbers, or income documents are captured or stored on intermediary servers during exploratory discovery.

---

## 2. Production-Scale Roadmap (Next Phase)

When transitioning SchemeSaathi to a national-scale government portal, the following enterprise capabilities will be integrated:

1. **Live Channel Partner & NPA Data Synchronization (NSFDC / DFS API)**:
   - Automated bi-directional data pipeline with the National Scheduled Castes Finance and Development Corporation (NSFDC) and Department of Financial Services (DFS) reporting systems.
   - Real-time updates to bank branch NPA percentages, active credit disbursement quotas, and nodal officer contact details.

2. **Per-User Application Lifecycle & DigiLocker Auth**:
   - **Jan Samarth / MeriPehchaan (Single Sign-On)** integration.
   - **DigiLocker Integration** for instant, paperless verification of Caste Certificates, Income Certificates, and Aadhaar without physical visits.
   - **End-to-End Application Tracking**: Generates official digital application dossiers that route directly to the designated Channel Partner branch portal with real-time SMS/WhatsApp status alerts.

3. **Ministry Admin Portal & Dynamic Scheme Rule Engine (PostgreSQL / Supabase)**:
   - Role-based Admin Dashboard for Ministry and NSFDC officials.
   - Dynamic parameter management: adjust scheme loan ceilings (e.g. ₹1.40L to ₹2.00L), interest subsidy slabs, and moratorium windows in real-time without modifying codebase or redeploying applications.
   - District-level analytics dashboard tracking scheme awareness, loan application volume, and credit channel utilization bottlenecks.
