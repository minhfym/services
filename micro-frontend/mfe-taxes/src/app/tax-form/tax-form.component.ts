import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tax-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatProgressBarModule, MatSnackBarModule
  ],
  template: `
    <div class="mfe-container">
      <div class="page-header">
        <button mat-icon-button routerLink="../">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h2>{{ editId ? 'Edit' : 'New' }} Tax Record</h2>
          <p class="subtitle">{{ editId ? 'Update existing' : 'Create a new' }} tax record</p>
        </div>
      </div>

      <mat-card class="form-card">
        <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()" class="tax-form">
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Taxpayer Name</mat-label>
                <input matInput formControlName="taxpayer_name" placeholder="Full name">
                <mat-error *ngIf="form.get('taxpayer_name')?.hasError('required')">Required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Taxpayer Email</mat-label>
                <input matInput formControlName="taxpayer_email" type="email">
                <mat-error *ngIf="form.get('taxpayer_email')?.hasError('email')">Invalid email</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Tax Type</mat-label>
                <mat-select formControlName="tax_type">
                  <mat-option value="income_tax">Income Tax</mat-option>
                  <mat-option value="property_tax">Property Tax</mat-option>
                  <mat-option value="business_tax">Business Tax</mat-option>
                  <mat-option value="vat">VAT</mat-option>
                  <mat-option value="capital_gains">Capital Gains Tax</mat-option>
                </mat-select>
                <mat-error *ngIf="form.get('tax_type')?.hasError('required')">Required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Amount (USD)</mat-label>
                <input matInput formControlName="amount" type="number" min="0" step="0.01">
                <mat-icon matPrefix>attach_money</mat-icon>
                <mat-error *ngIf="form.get('amount')?.hasError('required')">Required</mat-error>
                <mat-error *ngIf="form.get('amount')?.hasError('min')">Must be positive</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Tax Year</mat-label>
                <input matInput formControlName="tax_year" type="number" placeholder="2024">
                <mat-error *ngIf="form.get('tax_year')?.hasError('required')">Required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Due Date</mat-label>
                <input matInput formControlName="due_date" [matDatepicker]="picker">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes</mat-label>
              <textarea matInput formControlName="notes" rows="3" placeholder="Additional notes..."></textarea>
            </mat-form-field>

            <div class="error-message" *ngIf="error">
              <mat-icon>error_outline</mat-icon>
              <span>{{ error }}</span>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="../">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="loading || form.invalid">
                <mat-icon>save</mat-icon>
                {{ editId ? 'Update' : 'Create' }} Record
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .mfe-container { padding: 0; }
    .page-header {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 20px;
      h2 { font-size: 22px; font-weight: 700; color: #1a237e; margin: 0 0 4px; }
      .subtitle { font-size: 13px; color: #757575; margin: 0; }
    }
    .form-card { border-radius: 12px !important; }
    .tax-form { padding: 8px 0; }
    .form-row { display: flex; gap: 16px; }
    .half-width { flex: 1; }
    .full-width { width: 100%; }
    .error-message {
      display: flex; align-items: center; gap: 8px;
      color: #c62828; margin-bottom: 16px;
      padding: 10px 14px; background: #ffebee; border-radius: 6px;
    }
    .form-actions {
      display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px;
    }
  `]
})
export class TaxFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    taxpayer_name: ['', Validators.required],
    taxpayer_email: ['', Validators.email],
    tax_type: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0)]],
    tax_year: [new Date().getFullYear(), Validators.required],
    due_date: [''],
    notes: [''],
  });

  loading = false;
  error = '';
  editId: string | null = null;

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) this.loadRecord(this.editId);
  }

  loadRecord(id: string): void {
    this.loading = true;
    const token = localStorage.getItem('gov_token');
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
    this.http.get<any>(`http://localhost:8000/api/taxes/${id}`, { headers }).subscribe({
      next: (rec) => { this.form.patchValue(rec); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const token = localStorage.getItem('gov_token');
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
    const url = this.editId
      ? `http://localhost:8000/api/taxes/${this.editId}`
      : 'http://localhost:8000/api/taxes';
    const req = this.editId
      ? this.http.put(url, this.form.value, { headers })
      : this.http.post(url, this.form.value, { headers });

    req.subscribe({
      next: () => {
        this.snackBar.open('Tax record saved successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to save tax record.';
        this.loading = false;
      }
    });
  }
}
