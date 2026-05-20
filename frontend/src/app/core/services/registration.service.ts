import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration, RegistrationCreateDto } from '../models/registration.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private apiUrl = `${environment.apiUrl}/registrations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Registration> {
    return this.http.get<Registration>(`${this.apiUrl}/${id}/`);
  }

  create(data: RegistrationCreateDto): Observable<Registration> {
    return this.http.post<Registration>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Partial<RegistrationCreateDto>): Observable<Registration> {
    return this.http.patch<Registration>(`${this.apiUrl}/${id}/`, data);
  }

  approve(id: number): Observable<Registration> {
    return this.http.post<Registration>(`${this.apiUrl}/${id}/approve/`, {});
  }

  reject(id: number, reason: string): Observable<Registration> {
    return this.http.post<Registration>(`${this.apiUrl}/${id}/reject/`, { reason });
  }
}
