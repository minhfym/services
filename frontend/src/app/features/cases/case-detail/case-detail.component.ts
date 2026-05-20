import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CaseService } from '../../../core/services/case.service';
import { AuthService } from '../../../core/services/auth.service';
import { Case } from '../../../core/models/case.model';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './case-detail.component.html',
  styleUrl: './case-detail.component.scss'
})
export class CaseDetailComponent implements OnInit {
  case_: Case | null = null;
  loading = true;
  isOfficer = false;

  constructor(
    private caseService: CaseService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isOfficer = this.authService.isOfficer();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.caseService.getById(+id).subscribe({
      next: (c) => { this.case_ = c; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/cases']); }
    });
  }

  closeCase(): void {
    if (!this.case_) return;
    this.caseService.close(this.case_.id, 'Case closed by officer').subscribe({
      next: (c) => {
        this.case_ = c;
        this.snackBar.open('Case closed!', 'Close', { duration: 3000, panelClass: ['success-snack'] });
      },
      error: (err) => this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000 })
    });
  }
}
