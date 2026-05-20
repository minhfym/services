import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  total_tax_collections: number;
  active_permits: number;
  registered_lands: number;
  open_cases: number;
  grant_applications: number;
  pending_registrations: number;
}

export interface ActivityItem {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats/`).pipe(
      catchError(() => of({
        total_tax_collections: 0,
        active_permits: 0,
        registered_lands: 0,
        open_cases: 0,
        grant_applications: 0,
        pending_registrations: 0
      }))
    );
  }

  getRecentActivity(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.apiUrl}/dashboard/activity/`).pipe(
      catchError(() => of([]))
    );
  }
}
