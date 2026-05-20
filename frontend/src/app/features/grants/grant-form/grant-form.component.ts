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
import { GrantService } from '../../../core/services/grant.service';

@Component({
  selector: 'app-grant-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDatepickerModule,
    MatNativeDateModule, MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './grant-form.component.html',
  styleUrl: './grant-form.component.scss'
})
export class GrantFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEdit = false;
  grantId: number | null = null;

  grantTypes = ['education', 'business', 'agriculture', 'infrastructure', 'health', 'other'];

  constructor(
    private fb: FormBuilder,
    private grantService: GrantService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      grant_type: ['education', Validators.required],
      total_amount: ['', [Validators.required, Validators.min(0)]],
      deadline: ['', Validators.required],
      eligibility_criteria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.grantId = +id;
      this.grantService.getById(+id).subscribe({
        next: (g) => { this.form.patchValue(g); this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const op = this.isEdit && this.grantId
      ? this.grantService.update(this.grantId, this.form.value)
      : this.grantService.create(this.form.value);

    op.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Grant updated!' : 'Grant created!', 'Close', { duration: 3000, panelClass: ['success-snack'] });
        this.router.navigate(['/grants']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000, panelClass: ['error-snack'] });
      }
    });
  }
}
