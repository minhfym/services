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
import { LandService } from '../../../core/services/land.service';

@Component({
  selector: 'app-land-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDatepickerModule,
    MatNativeDateModule, MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './land-form.component.html',
  styleUrl: './land-form.component.scss'
})
export class LandFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEdit = false;
  landId: number | null = null;

  landUses = ['residential', 'commercial', 'agricultural', 'industrial', 'other'];

  constructor(
    private fb: FormBuilder,
    private landService: LandService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      parcel_number: ['', Validators.required],
      owner_name: ['', Validators.required],
      owner_id: ['', Validators.required],
      location: ['', Validators.required],
      district: ['', Validators.required],
      area_sqm: ['', [Validators.required, Validators.min(1)]],
      land_use: ['residential', Validators.required],
      registration_date: ['', Validators.required],
      valuation: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.landId = +id;
      this.landService.getById(+id).subscribe({
        next: (l) => { this.form.patchValue(l); this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const op = this.isEdit && this.landId
      ? this.landService.update(this.landId, this.form.value)
      : this.landService.create(this.form.value);

    op.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Land record updated!' : 'Land registered!', 'Close', { duration: 3000, panelClass: ['success-snack'] });
        this.router.navigate(['/lands']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000, panelClass: ['error-snack'] });
      }
    });
  }
}
