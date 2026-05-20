import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grant, GrantCreateDto, GrantApplication, GrantApplicationCreateDto } from '../models/grant.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GrantService {
  private apiUrl = `${environment.apiUrl}/grants`;
  private appUrl = `${environment.apiUrl}/grant-applications`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Grant[]> {
    return this.http.get<Grant[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Grant> {
    return this.http.get<Grant>(`${this.apiUrl}/${id}/`);
  }

  create(data: GrantCreateDto): Observable<Grant> {
    return this.http.post<Grant>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Partial<GrantCreateDto>): Observable<Grant> {
    return this.http.patch<Grant>(`${this.apiUrl}/${id}/`, data);
  }

  getAllApplications(): Observable<GrantApplication[]> {
    return this.http.get<GrantApplication[]>(`${this.appUrl}/`);
  }

  getApplicationById(id: number): Observable<GrantApplication> {
    return this.http.get<GrantApplication>(`${this.appUrl}/${id}/`);
  }

  createApplication(data: GrantApplicationCreateDto): Observable<GrantApplication> {
    return this.http.post<GrantApplication>(`${this.appUrl}/`, data);
  }

  approveApplication(id: number): Observable<GrantApplication> {
    return this.http.post<GrantApplication>(`${this.appUrl}/${id}/approve/`, {});
  }

  rejectApplication(id: number, reason: string): Observable<GrantApplication> {
    return this.http.post<GrantApplication>(`${this.appUrl}/${id}/reject/`, { reason });
  }
}
