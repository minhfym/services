export interface Tax {
  id: number;
  taxpayer_name: string;
  taxpayer_id: string;
  tax_type: 'income' | 'property' | 'business' | 'vat' | 'other';
  amount: number;
  due_date: string;
  payment_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  period: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TaxCreateDto {
  taxpayer_name: string;
  taxpayer_id: string;
  tax_type: string;
  amount: number;
  due_date: string;
  period: string;
  notes?: string;
}
