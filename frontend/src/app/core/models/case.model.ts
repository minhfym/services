export interface Case {
  id: number;
  case_number: string;
  title: string;
  description: string;
  case_type: 'civil' | 'criminal' | 'administrative' | 'land_dispute' | 'tax_dispute' | 'other';
  plaintiff_name: string;
  plaintiff_id?: string;
  defendant_name: string;
  defendant_id?: string;
  assigned_officer?: string;
  filed_date: string;
  hearing_date?: string;
  status: 'open' | 'under_review' | 'hearing' | 'closed' | 'appealed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  resolution?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CaseCreateDto {
  title: string;
  description: string;
  case_type: string;
  plaintiff_name: string;
  plaintiff_id?: string;
  defendant_name: string;
  defendant_id?: string;
  filed_date: string;
  hearing_date?: string;
  priority: string;
  notes?: string;
}
