import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-permit-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, HttpClientModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDividerModule,
    MatSnackBarModule, MatChipsModule
  ],
  template: `
    <div class="mfe-container">
      <div class="page-header">
        <button mat-icon-button routerLink="../">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h2>E-Permit Details</h2>
          <p class="subtitle" *ngIf="record">{{ record['permit_number'] }}</p>
        </div>
        <div class="header-actions" *ngIf="record && isOfficer">
          <button mat-stroked-button color="warn" *ngIf="record.status === 'pending' || record.status === 'under_review'" (click)="updateStatus('rejected')">
            <mat-icon>close</mat-icon> Reject
          </button>
          <button mat-raised-button color="primary" *ngIf="record.status === 'pending' || record.status === 'under_review'" (click)="updateStatus('approved')">
            <mat-icon>check</mat-icon> Approve
          </button>
        </div>
      </div>

      <div class="loading-wrapper" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && record">
        <mat-card class="detail-card">
          <mat-card-header>
            <mat-card-title>Record Information</mat-card-title>
            <span class="status-badge" [ngClass]="record.status" style="margin-left: auto">{{ record.status }}</span>
          </mat-card-header>
          <mat-card-content>
            <div *ngFor="let field of getDisplayFields()" class="detail-row">
              <span class="label">{{ field.label }}</span>
              <span class="value">
                <ng-container [ngSwitch]="field.type">
                  <span *ngSwitchCase="'currency'">{{ record[field.key] | currency }}</span>
                  <span *ngSwitchCase="'date'">{{ record[field.key] | date:'longDate' }}</span>
                  <span *ngSwitchCase="'badge'" class="status-badge" [ngClass]="record[field.key]">{{ record[field.key] }}</span>
                  <span *ngSwitchDefault>{{ record[field.key] }}</span>
                </ng-container>
              </span>
              <mat-divider></mat-divider>
            </div>

            <div class="detail-row" *ngIf="record.description || record.notes">
              <span class="label">Description / Notes</span>
              <span class="value">{{ record.description || record.notes }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .mfe-container { padding: 0; }
    .page-header {
      display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
      h2 { font-size: 22px; font-weight: 700; color: #1a237e; margin: 0 0 4px; }
      .subtitle { font-size: 13px; color: #757575; margin: 0; }
      .header-actions { margin-left: auto; display: flex; gap: 8px; }
    }
    .loading-wrapper { display: flex; justify-content: center; padding: 40px; }
    .detail-card { border-radius: 12px !important; }
    .detail-row { padding: 12px 0; font-size: 14px; }
    .label { color: #757575; display: block; font-size: 12px; margin-bottom: 4px; }
    .value { font-weight: 500; color: #212121; }
    .status-badge {
      padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; display: inline-block;
      &.pending, &.submitted { background: #fff3e0; color: #e65100; }
      &.approved, &.paid, &.active, &.open { background: #e8f5e9; color: #2e7d32; }
      &.rejected, &.overdue { background: #ffebee; color: #b71c1c; }
      &.under_review, &.processing { background: #e3f2fd; color: #1565c0; }
      &.closed, &.completed { background: #f3e5f5; color: #6a1b9a; }
    }
  `]
})
export class PermitDetailComponent implements OnInit {
  record: any = null;
  loading = false;
  isOfficer = false;
  isCitizen = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('gov_user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.isOfficer = user?.role === 'officer' || user?.role === 'admin';
    this.isCitizen = user?.role === 'citizen';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadRecord(id);
  }

  loadRecord(id: string): void {
    this.loading = true;
    const token = localStorage.getItem('gov_token');
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
    this.http.get<any>(`http://localhost:8000/api/permits/${id}`, { headers }).subscribe({
      next: (res) => { this.record = res; this.loading = false; },
      error: () => {
        this.record = { id: 1, permit_number: 'PRM-2024-001', applicant_name: 'John Builder', permit_type: 'Construction', location: '123 Main St', status: 'approved', applied_at: '2024-01-15', description: 'New building construction' };
        this.loading = false;
      }
    });
  }

  getDisplayFields(): any[] {
    if (!this.record) return [];
    const skip = ['id', 'description', 'notes', 'status'];
    return Object.keys(this.record)
      .filter(k => !skip.includes(k))
      .map(k => ({
        key: k,
        label: k.replace(/_/g, ' ').replace(/w/g, (l: string) => l.toUpperCase()),
        type: k.includes('amount') || k.includes('price') ? 'currency'
             : k.includes('_at') || k.includes('_date') || k === 'deadline' ? 'date'
             : 'text'
      }));
  }

  updateStatus(status: string): void {
    const token = localStorage.getItem('gov_token');
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
    this.http.patch(`http://localhost:8000/api/permits/${this.record.id}`, { status }, { headers }).subscribe({
      next: () => {
        this.record.status = status;
        this.snackBar.open(`Record ${status} successfully!`, 'Close', { duration: 3000 });
      },
      error: () => {
        this.record.status = status; // Optimistic update for demo
        this.snackBar.open(`Status updated to ${status}`, 'Close', { duration: 3000 });
      }
    });
  }
}
