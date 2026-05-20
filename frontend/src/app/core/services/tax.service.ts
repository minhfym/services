import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tax, TaxCreateDto } from '../models/tax.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaxService {
  private apiUrl = `${environment.apiUrl}/taxes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tax[]> {
    return this.http.get<Tax[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Tax> {
    return this.http.get<Tax>(`${this.apiUrl}/${id}/`);
  }

  create(data: TaxCreateDto): Observable<Tax> {
    return this.http.post<Tax>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Partial<TaxCreateDto>): Observable<Tax> {
    return this.http.patch<Tax>(`${this.apiUrl}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  markAsPaid(id: number): Observable<Tax> {
    return this.http.post<Tax>(`${this.apiUrl}/${id}/pay/`, {});
  }
}
