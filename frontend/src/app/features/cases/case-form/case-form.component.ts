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
import { CaseService } from '../../../core/services/case.service';

@Component({
  selector: 'app-case-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDatepickerModule,
    MatNativeDateModule, MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './case-form.component.html',
  styleUrl: './case-form.component.scss'
})
export class CaseFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEdit = false;
  caseId: number | null = null;

  caseTypes = ['civil', 'criminal', 'administrative', 'land_dispute', 'tax_dispute', 'other'];
  priorities = ['low', 'medium', 'high', 'urgent'];

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      case_type: ['civil', Validators.required],
      plaintiff_name: ['', Validators.required],
      plaintiff_id: [''],
      defendant_name: ['', Validators.required],
      defendant_id: [''],
      filed_date: ['', Validators.required],
      hearing_date: [''],
      priority: ['medium', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.caseId = +id;
      this.caseService.getById(+id).subscribe({
        next: (c) => { this.form.patchValue(c); this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const op = this.isEdit && this.caseId
      ? this.caseService.update(this.caseId, this.form.value)
      : this.caseService.create(this.form.value);

    op.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Case updated!' : 'Case filed!', 'Close', { duration: 3000, panelClass: ['success-snack'] });
        this.router.navigate(['/cases']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000, panelClass: ['error-snack'] });
      }
    });
  }
}
