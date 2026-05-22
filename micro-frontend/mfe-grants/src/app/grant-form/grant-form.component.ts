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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-grant-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSelectModule, MatProgressBarModule, MatSnackBarModule
  ],
  template: `
    <div class="mfe-container">
      <div class="page-header">
        <button mat-icon-button routerLink="../">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h2>{{ editId ? 'Edit' : 'New' }} Grants Managemen Record</h2>
          <p class="subtitle">Fill in the details below</p>
        </div>
      </div>
      <mat-card class="form-card">
        <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()" class="record-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title / Name</mat-label>
              <input matInput formControlName="title" placeholder="Enter title or name">
              <mat-error *ngIf="form.get('title')?.hasError('required')">Required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="4" placeholder="Detailed description..."></textarea>
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
      display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
      h2 { font-size: 22px; font-weight: 700; color: #1a237e; margin: 0 0 4px; }
      .subtitle { font-size: 13px; color: #757575; margin: 0; }
    }
    .form-card { border-radius: 12px !important; }
    .record-form { padding: 8px 0; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .error-message {
      display: flex; align-items: center; gap: 8px;
      color: #c62828; margin-bottom: 16px;
      padding: 10px 14px; background: #ffebee; border-radius: 6px;
    }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
  `]
})
export class GrantFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
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
    this.http.get<any>(`http://localhost:8000/api/grants/${id}`, { headers }).subscribe({
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
      ? `http://localhost:8000/api/grants/${this.editId}`
      : 'http://localhost:8000/api/grants';
    const req = this.editId
      ? this.http.put(url, this.form.value, { headers })
      : this.http.post(url, this.form.value, { headers });

    req.subscribe({
      next: () => {
        this.snackBar.open('Record saved successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Failed to save record.';
        this.loading = false;
      }
    });
  }
}
