export interface Permit {
  id: number;
  applicant_name: string;
  applicant_id: string;
  permit_type: 'construction' | 'business' | 'environmental' | 'event' | 'other';
  description: string;
  location: string;
  issue_date?: string;
  expiry_date?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired';
  fee: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PermitCreateDto {
  applicant_name: string;
  applicant_id: string;
  permit_type: string;
  description: string;
  location: string;
  fee: number;
  notes?: string;
}
