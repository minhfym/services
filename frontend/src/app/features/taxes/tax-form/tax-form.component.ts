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
import { TaxService } from '../../../core/services/tax.service';

@Component({
  selector: 'app-tax-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDatepickerModule,
    MatNativeDateModule, MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './tax-form.component.html',
  styleUrl: './tax-form.component.scss'
})
export class TaxFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEdit = false;
  taxId: number | null = null;

  taxTypes = ['income', 'property', 'business', 'vat', 'other'];

  constructor(
    private fb: FormBuilder,
    private taxService: TaxService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      taxpayer_name: ['', [Validators.required]],
      taxpayer_id: ['', [Validators.required]],
      tax_type: ['income', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
      due_date: ['', [Validators.required]],
      period: ['', [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.taxId = +id;
      this.loadTax(+id);
    }
  }

  loadTax(id: number): void {
    this.loading = true;
    this.taxService.getById(id).subscribe({
      next: (tax) => {
        this.form.patchValue(tax);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const data = this.form.value;

    const op = this.isEdit && this.taxId
      ? this.taxService.update(this.taxId, data)
      : this.taxService.create(data);

    op.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Tax record updated!' : 'Tax record created!', 'Close', {
          duration: 3000, panelClass: ['success-snack']
        });
        this.router.navigate(['/taxes']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err?.error?.detail || 'Operation failed', 'Close', {
          duration: 3000, panelClass: ['error-snack']
        });
      }
    });
  }
}
