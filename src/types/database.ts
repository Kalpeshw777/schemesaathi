export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      schemes: {
        Row: {
          id: string;
          code: string;
          name: Json;
          short_description: Json;
          full_description: Json;
          target_beneficiary: Json;
          category: string;
          max_loan_amount: number;
          min_interest_rate: number;
          max_interest_rate: number;
          female_rebate_percent: number | null;
          subsidy_percent: number | null;
          moratorium_months_min: number;
          moratorium_months_max: number;
          max_tenure_years: number;
          eligible_partner_types: string[];
          max_family_income: number;
          key_benefits: Json;
          required_documents: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: Json;
          short_description: Json;
          full_description: Json;
          target_beneficiary: Json;
          category: string;
          max_loan_amount: number;
          min_interest_rate: number;
          max_interest_rate: number;
          female_rebate_percent?: number | null;
          subsidy_percent?: number | null;
          moratorium_months_min: number;
          moratorium_months_max: number;
          max_tenure_years: number;
          eligible_partner_types: string[];
          max_family_income?: number;
          key_benefits: Json;
          required_documents: string[];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["schemes"]["Insert"]>;
      };
      partners: {
        Row: {
          id: string;
          name: string;
          type: string;
          branch_name: string;
          address: string;
          district: string;
          state: string;
          pincode: string;
          contact_number: string;
          email: string;
          nodal_officer: string;
          latitude: number;
          longitude: number;
          health_score: number;
          npa_percent: number;
          is_accepting_applications: boolean;
          supported_scheme_codes: string[];
          average_sanction_days: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          branch_name: string;
          address: string;
          district: string;
          state: string;
          pincode: string;
          contact_number: string;
          email: string;
          nodal_officer: string;
          latitude: number;
          longitude: number;
          health_score: number;
          npa_percent: number;
          is_accepting_applications?: boolean;
          supported_scheme_codes: string[];
          average_sanction_days?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["partners"]["Insert"]>;
      };
      applications: {
        Row: {
          id: string;
          applicant_name: string | null;
          project_type: string;
          category: string;
          project_cost: number;
          family_income: number;
          recommended_scheme_code: string;
          recommended_partner_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          applicant_name?: string | null;
          project_type: string;
          category: string;
          project_cost: number;
          family_income: number;
          recommended_scheme_code: string;
          recommended_partner_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
      };
    };
  };
}
