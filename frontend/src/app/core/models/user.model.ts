export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'officer' | 'citizen';
  phone?: string;
  address?: string;
  national_id?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
