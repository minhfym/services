export interface Land {
  id: number;
  parcel_number: string;
  owner_name: string;
  owner_id: string;
  location: string;
  district: string;
  area_sqm: number;
  land_use: 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'other';
  registration_date: string;
  status: 'registered' | 'pending' | 'disputed' | 'transferred';
  valuation?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LandCreateDto {
  parcel_number: string;
  owner_name: string;
  owner_id: string;
  location: string;
  district: string;
  area_sqm: number;
  land_use: string;
  registration_date: string;
  valuation?: number;
  notes?: string;
}
