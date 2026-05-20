import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Land, LandCreateDto } from '../models/land.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LandService {
  private apiUrl = `${environment.apiUrl}/lands`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Land[]> {
    return this.http.get<Land[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Land> {
    return this.http.get<Land>(`${this.apiUrl}/${id}/`);
  }

  create(data: LandCreateDto): Observable<Land> {
    return this.http.post<Land>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Partial<LandCreateDto>): Observable<Land> {
    return this.http.patch<Land>(`${this.apiUrl}/${id}/`, data);
  }

  approve(id: number): Observable<Land> {
    return this.http.post<Land>(`${this.apiUrl}/${id}/approve/`, {});
  }
}
