import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Case, CaseCreateDto } from '../models/case.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CaseService {
  private apiUrl = `${environment.apiUrl}/cases`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Case[]> {
    return this.http.get<Case[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Case> {
    return this.http.get<Case>(`${this.apiUrl}/${id}/`);
  }

  create(data: CaseCreateDto): Observable<Case> {
    return this.http.post<Case>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Partial<CaseCreateDto>): Observable<Case> {
    return this.http.patch<Case>(`${this.apiUrl}/${id}/`, data);
  }

  close(id: number, resolution: string): Observable<Case> {
    return this.http.post<Case>(`${this.apiUrl}/${id}/close/`, { resolution });
  }
}
