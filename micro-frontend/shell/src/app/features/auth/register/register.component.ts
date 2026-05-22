import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule, MatProgressBarModule
  ],
  template: `
    <div class="register-page">
      <div class="gov-branding">
        <mat-icon class="gov-icon">account_balance</mat-icon>
        <h1>Government Services Portal</h1>
        <p>Create your account to access government services</p>
      </div>

      <mat-card class="register-card">
        <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Fill in your details to register</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="name" placeholder="John Doe">
              <mat-icon matPrefix>person</mat-icon>
              <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <input matInput formControlName="email" type="email" placeholder="you@example.com">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>National ID</mat-label>
              <input matInput formControlName="national_id" placeholder="Your national ID number">
              <mat-icon matPrefix>badge</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone Number</mat-label>
              <input matInput formControlName="phone" placeholder="+1 234 567 8900">
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="form.get('password')?.hasError('minlength')">At least 6 characters</mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="error">
              <mat-icon>error_outline</mat-icon>
              <span>{{ error }}</span>
            </div>

            <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="loading || form.invalid">
              <mat-icon *ngIf="!loading">person_add</mat-icon>
              <span>{{ loading ? 'Creating account...' : 'Create Account' }}</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p class="login-link">
            Already have an account? <a routerLink="/login">Sign in here</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #283593 40%, #3949ab 100%);
      padding: 24px;
    }
    .gov-branding {
      text-align: center;
      margin-bottom: 24px;
      color: #fff;
      .gov-icon { font-size: 48px; width: 48px; height: 48px; color: #ffd740; }
      h1 { font-size: 24px; font-weight: 700; margin: 8px 0 6px; }
      p { font-size: 13px; opacity: 0.75; margin: 0; }
    }
    .register-card {
      width: 100%;
      max-width: 460px;
      border-radius: 16px !important;
      box-shadow: 0 24px 48px rgba(0,0,0,0.3) !important;
      mat-card-header { padding: 20px 24px 0; }
      mat-card-content { padding: 16px 24px; }
      mat-card-actions { padding: 0 24px 16px; margin: 0; }
    }
    .full-width { width: 100%; margin-bottom: 4px; }
    .error-message {
      display: flex; align-items: center; gap: 8px;
      color: #c62828; font-size: 13px; margin-bottom: 12px;
      padding: 10px 14px; background: #ffebee; border-radius: 6px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }
    .submit-btn {
      width: 100%; height: 46px; font-size: 15px; font-weight: 600;
      border-radius: 8px !important; background: #1a237e !important; margin-top: 4px;
    }
    .login-link {
      text-align: center; font-size: 13px; color: #616161; margin: 0;
      a { color: #1a237e; font-weight: 600; text-decoration: none; }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    national_id: [''],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  loading = false;
  error = '';
  hidePassword = true;

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
