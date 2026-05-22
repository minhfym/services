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

@Component({
  selector: 'app-tax-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, HttpClientModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDividerModule, MatSnackBarModule
  ],
  template: `
    <div class="mfe-container">
      <div class="page-header">
        <button mat-icon-button routerLink="../">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h2>Tax Record Details</h2>
          <p class="subtitle">{{ record?.tax_number }}</p>
        </div>
        <div class="header-actions" *ngIf="record">
          <button mat-stroked-button *ngIf="isOfficer" [routerLink]="['edit']">
            <mat-icon>edit</mat-icon> Edit
          </button>
          <button mat-raised-button color="primary" *ngIf="isCitizen && record.status !== 'paid'"
                  (click)="payTax()" [disabled]="payLoading">
            <mat-icon>payments</mat-icon> Pay {{ record.amount - record.paid_amount | currency }}
          </button>
        </div>
      </div>

      <div class="loading-wrapper" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && record">
        <div class="detail-grid">
          <mat-card class="detail-card">
            <mat-card-header>
              <mat-card-title>Tax Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="label">Tax Number</span>
                <span class="value">{{ record.tax_number }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="detail-row">
                <span class="label">Tax Type</span>
                <span class="value">{{ record.tax_type }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="detail-row">
                <span class="label">Tax Year</span>
                <span class="value">{{ record.tax_year }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="detail-row">
                <span class="label">Status</span>
                <span class="status-badge" [ngClass]="record.status">{{ record.status }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="detail-row">
                <span class="label">Due Date</span>
                <span class="value">{{ record.due_date | date:'longDate' }}</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="detail-card">
            <mat-card-header>
              <mat-card-title>Payment Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="label">Total Amount</span>
                <span class="value amount">{{ record.amount | currency }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="detail-row">
                <span class="label">Amount Paid</span>
                <span class="value paid">{{ record.paid_amount | currency }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="detail-row">
                <span class="label">Balance Due</span>
                <span class="value balance" [class.zero]="record.amount === record.paid_amount">
                  {{ record.amount - record.paid_amount | currency }}
                </span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="detail-card" *ngIf="isOfficer">
            <mat-card-header>
              <mat-card-title>Taxpayer Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="label">Name</span>
                <span class="value">{{ record.taxpayer_name }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="detail-row">
                <span class="label">Email</span>
                <span class="value">{{ record.taxpayer_email }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="detail-card" *ngIf="record.notes">
          <mat-card-header><mat-card-title>Notes</mat-card-title></mat-card-header>
          <mat-card-content><p>{{ record.notes }}</p></mat-card-content>
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
    .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px; }
    .detail-card { border-radius: 12px !important; }
    .detail-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 0; font-size: 14px;
    }
    .label { color: #757575; }
    .value { font-weight: 500; }
    .amount { color: #1a237e; font-size: 18px; font-weight: 700; }
    .paid { color: #2e7d32; font-weight: 600; }
    .balance { color: #c62828; font-weight: 700; &.zero { color: #2e7d32; } }
    .status-badge {
      padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;
      &.pending { background: #fff3e0; color: #e65100; }
      &.paid { background: #e8f5e9; color: #2e7d32; }
      &.overdue { background: #ffebee; color: #b71c1c; }
      &.processing { background: #e3f2fd; color: #1565c0; }
      &.partially_paid { background: #fce4ec; color: #880e4f; }
    }
  `]
})
export class TaxDetailComponent implements OnInit {
  record: any = null;
  loading = false;
  payLoading = false;
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
    this.http.get<any>(`http://localhost:8000/api/taxes/${id}`, { headers }).subscribe({
      next: (res) => { this.record = res; this.loading = false; },
      error: () => {
        this.record = { id: 1, tax_number: 'TAX-2024-001', taxpayer_name: 'John Doe', taxpayer_email: 'john@example.com', tax_type: 'Income Tax', amount: 5000, paid_amount: 0, status: 'pending', due_date: '2024-12-31', tax_year: 2024, notes: 'Annual income tax for 2024' };
        this.loading = false;
      }
    });
  }

  payTax(): void {
    this.payLoading = true;
    const token = localStorage.getItem('gov_token');
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
    this.http.post(`http://localhost:8000/api/taxes/${this.record.id}/pay`, { amount: this.record.amount - this.record.paid_amount }, { headers }).subscribe({
      next: () => {
        this.record.paid_amount = this.record.amount;
        this.record.status = 'paid';
        this.payLoading = false;
        this.snackBar.open('Payment successful!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Payment failed. Please try again.', 'Close', { duration: 3000 });
        this.payLoading = false;
      }
    });
  }
}
