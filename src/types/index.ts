export type Locale = "en" | "hi" | "mr";

export type ProjectType = "business" | "education";

export type BusinessCategory =
  | "retail_shop"
  | "agriculture_allied"
  | "manufacturing_handicrafts"
  | "transport_logistics"
  | "services_professional"
  | "sanitation_green"
  | "other";

export type EducationCategory =
  | "higher_ed_india"
  | "higher_ed_abroad"
  | "vocational_technical"
  | "medical_engineering";

export type Gender = "male" | "female" | "transgender" | "prefer_not_to_say";

export type EducationLevel =
  | "below_10th"
  | "10th_pass"
  | "12th_pass"
  | "graduate"
  | "post_graduate"
  | "professional_diploma";

export interface WizardAnswers {
  projectType: ProjectType;
  category: string;
  projectCost: number;
  familyIncome: number;
  educationLevel: EducationLevel;
  gender: Gender;
  state: string;
  district: string;
  hasPriorExperience: boolean;
  hasCollateral: boolean;
}

export type ChannelPartnerType = "SCA" | "PSB" | "RRB" | "NBFC_MFI";

export interface Scheme {
  id: string;
  code: string;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  shortDescription: {
    en: string;
    hi: string;
    mr: string;
  };
  fullDescription: {
    en: string;
    hi: string;
    mr: string;
  };
  targetBeneficiary: {
    en: string;
    hi: string;
    mr: string;
  };
  category: "micro_finance" | "term_loan" | "education_loan" | "special_concessional";
  maxLoanAmount: number; // in INR
  minInterestRate: number; // e.g. 5.0
  maxInterestRate: number; // e.g. 7.0
  femaleRebatePercent?: number; // e.g. 1.0% interest rebate
  subsidyPercent?: number; // e.g. 15-30% capital subsidy under certain slabs
  moratoriumMonthsMin: number;
  moratoriumMonthsMax: number;
  maxTenureYears: number;
  eligiblePartnerTypes: ChannelPartnerType[];
  maxFamilyIncome: number; // e.g. 500000 (₹5 Lakh)
  keyBenefits: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  requiredDocuments: string[];
}

export interface RecommendationResult {
  scheme: Scheme;
  eligibility: {
    isEligible: boolean;
    incomeCheck: boolean;
    costCheck: boolean;
    categoryCheck: boolean;
    details: string;
  };
  confidence: number; // 0 to 100
  reasoning: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  matchedProfile: WizardAnswers;
  aiExplanation?: string;
}

export interface ChannelPartner {
  id: string;
  name: string;
  type: ChannelPartnerType;
  branchName: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  contactNumber: string;
  email: string;
  nodalOfficer: string;
  latitude: number;
  longitude: number;
  healthScore: number; // 0 to 100 (Derived from NPA & prompt sanctioning)
  npaPercent: number; // e.g. 2.1%
  isAcceptingApplications: boolean;
  supportedSchemeCodes: string[];
  averageSanctionDays: number;
  distanceKm?: number;
  compositeRankScore?: number;
}

export interface AmortizationRow {
  month: number;
  year: number;
  isMoratorium: boolean;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
  remainingBalance: number;
}

export interface CalculatorResult {
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  tenureMonths: number;
  moratoriumMonths: number;
  monthlyEMI: number;
  totalInterestPaid: number;
  totalRepayment: number;
  commercialComparison: {
    commercialRate: number;
    commercialEMI: number;
    commercialTotalInterest: number;
    totalSavings: number;
  };
  schedule: AmortizationRow[];
}

export interface DocumentItem {
  id: string;
  title: {
    en: string;
    hi: string;
    mr: string;
  };
  description: {
    en: string;
    hi: string;
    mr: string;
  };
  issuingAuthority: {
    en: string;
    hi: string;
    mr: string;
  };
  category: "identity_caste" | "income_residence" | "project_business" | "education" | "banking";
  schemeCodes: string[];
  mandatory: boolean;
  tip: {
    en: string;
    hi: string;
    mr: string;
  };
}
