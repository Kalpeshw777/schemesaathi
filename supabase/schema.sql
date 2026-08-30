-- SchemeSaathi (SIH26092) Supabase Schema
-- Ministry of Social Justice and Empowerment - Concessional Loan Platform

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Schemes Table
CREATE TABLE IF NOT EXISTS public.schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name JSONB NOT NULL,
    short_description JSONB NOT NULL,
    full_description JSONB NOT NULL,
    target_beneficiary JSONB NOT NULL,
    category VARCHAR(50) NOT NULL,
    max_loan_amount NUMERIC NOT NULL,
    min_interest_rate NUMERIC NOT NULL,
    max_interest_rate NUMERIC NOT NULL,
    female_rebate_percent NUMERIC DEFAULT 0,
    subsidy_percent NUMERIC DEFAULT 0,
    moratorium_months_min INT NOT NULL DEFAULT 0,
    moratorium_months_max INT NOT NULL DEFAULT 6,
    max_tenure_years INT NOT NULL DEFAULT 5,
    eligible_partner_types TEXT[] NOT NULL,
    max_family_income NUMERIC NOT NULL DEFAULT 500000,
    key_benefits JSONB NOT NULL,
    required_documents TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Partners Table (Channel Partners: SCAs, PSBs, RRBs, NBFC-MFIs)
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nodal_officer VARCHAR(150) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    health_score NUMERIC NOT NULL DEFAULT 85,
    npa_percent NUMERIC NOT NULL DEFAULT 2.5,
    is_accepting_applications BOOLEAN NOT NULL DEFAULT TRUE,
    supported_scheme_codes TEXT[] NOT NULL,
    average_sanction_days INT NOT NULL DEFAULT 14,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Applications Table (Demonstration & Audit Logging)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_name VARCHAR(150),
    project_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    project_cost NUMERIC NOT NULL,
    family_income NUMERIC NOT NULL,
    recommended_scheme_code VARCHAR(50) NOT NULL,
    recommended_partner_id UUID REFERENCES public.partners(id),
    status VARCHAR(50) NOT NULL DEFAULT 'RECOMMENDED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 6. Public Read Policies
CREATE POLICY "Public schemes read access" ON public.schemes FOR SELECT USING (true);
CREATE POLICY "Public partners read access" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Public applications insert access" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public applications read access" ON public.applications FOR SELECT USING (true);

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_schemes_code ON public.schemes(code);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON public.schemes(category);
CREATE INDEX IF NOT EXISTS idx_partners_state_district ON public.partners(state, district);
CREATE INDEX IF NOT EXISTS idx_partners_type ON public.partners(type);
CREATE INDEX IF NOT EXISTS idx_partners_health ON public.partners(health_score);
