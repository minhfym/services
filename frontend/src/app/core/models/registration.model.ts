export interface Registration {
  id: number;
  registration_number: string;
  full_name: string;
  national_id: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: string;
  district: string;
  registration_type: 'birth' | 'death' | 'marriage' | 'citizenship' | 'business' | 'other';
  status: 'pending' | 'verified' | 'approved' | 'rejected';
  submitted_at: string;
  verified_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RegistrationCreateDto {
  full_name: string;
  national_id: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  registration_type: string;
  notes?: string;
}
