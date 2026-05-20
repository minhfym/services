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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PermitService } from '../../../core/services/permit.service';

@Component({
  selector: 'app-permit-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './permit-form.component.html',
  styleUrl: './permit-form.component.scss'
})
export class PermitFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEdit = false;
  permitId: number | null = null;

  permitTypes = ['construction', 'business', 'environmental', 'event', 'other'];

  constructor(
    private fb: FormBuilder,
    private permitService: PermitService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      applicant_name: ['', Validators.required],
      applicant_id: ['', Validators.required],
      permit_type: ['business', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      fee: ['', [Validators.required, Validators.min(0)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.permitId = +id;
      this.loadPermit(+id);
    }
  }

  loadPermit(id: number): void {
    this.loading = true;
    this.permitService.getById(id).subscribe({
      next: (p) => { this.form.patchValue(p); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const op = this.isEdit && this.permitId
      ? this.permitService.update(this.permitId, this.form.value)
      : this.permitService.create(this.form.value);

    op.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Permit updated!' : 'Permit created!', 'Close', { duration: 3000, panelClass: ['success-snack'] });
        this.router.navigate(['/permits']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.detail || 'Operation failed', 'Close', { duration: 3000, panelClass: ['error-snack'] });
      }
    });
  }
}
