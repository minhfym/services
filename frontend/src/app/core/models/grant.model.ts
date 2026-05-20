export interface Grant {
  id: number;
  title: string;
  description: string;
  grant_type: 'education' | 'business' | 'agriculture' | 'infrastructure' | 'health' | 'other';
  total_amount: number;
  available_amount: number;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  eligibility_criteria: string;
  created_at: string;
  updated_at: string;
}

export interface GrantApplication {
  id: number;
  grant_id: number;
  grant_title?: string;
  applicant_name: string;
  applicant_id: string;
  organization?: string;
  requested_amount: number;
  purpose: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  notes?: string;
}

export interface GrantCreateDto {
  title: string;
  description: string;
  grant_type: string;
  total_amount: number;
  deadline: string;
  eligibility_criteria: string;
}

export interface GrantApplicationCreateDto {
  grant_id: number;
  applicant_name: string;
  applicant_id: string;
  organization?: string;
  requested_amount: number;
  purpose: string;
}
