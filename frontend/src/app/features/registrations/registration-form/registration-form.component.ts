import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RegistrationService } from '../../../core/services/registration.service';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDatepickerModule,
    MatNativeDateModule, MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEdit = false;
  registrationId: number | null = null;

  registrationTypes = ['birth', 'death', 'marriage', 'citizenship', 'business', 'other'];
  genders = ['male', 'female', 'other'];

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      full_name: ['', Validators.required],
      national_id: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['male', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.email],
      address: ['', Validators.required],
      district: ['', Validators.required],
      registration_type: ['birth', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.registrationId = +id;
      this.registrationService.getById(+id).subscribe({
        next: (r) => { this.form.patchValue(r); this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const op = this.isEdit && this.registrationId
      ? this.registrationService.update(this.registrationId, this.form.value)
      : this.registrationService.create(this.form.value);

    op.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Registration updated!' : 'Registration submitted!', 'Close', { duration: 3000, panelClass: ['success-snack'] });
        this.router.navigate(['/registrations']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000, panelClass: ['error-snack'] });
      }
    });
  }
}
