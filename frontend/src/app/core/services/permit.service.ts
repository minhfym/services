import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permit, PermitCreateDto } from '../models/permit.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PermitService {
  private apiUrl = `${environment.apiUrl}/permits`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Permit[]> {
    return this.http.get<Permit[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Permit> {
    return this.http.get<Permit>(`${this.apiUrl}/${id}/`);
  }

  create(data: PermitCreateDto): Observable<Permit> {
    return this.http.post<Permit>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Partial<PermitCreateDto>): Observable<Permit> {
    return this.http.patch<Permit>(`${this.apiUrl}/${id}/`, data);
  }

  approve(id: number): Observable<Permit> {
    return this.http.post<Permit>(`${this.apiUrl}/${id}/approve/`, {});
  }

  reject(id: number, reason: string): Observable<Permit> {
    return this.http.post<Permit>(`${this.apiUrl}/${id}/reject/`, { reason });
  }
}
