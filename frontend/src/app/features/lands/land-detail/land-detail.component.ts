import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LandService } from '../../../core/services/land.service';
import { AuthService } from '../../../core/services/auth.service';
import { Land } from '../../../core/models/land.model';

@Component({
  selector: 'app-land-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './land-detail.component.html',
  styleUrl: './land-detail.component.scss'
})
export class LandDetailComponent implements OnInit {
  land: Land | null = null;
  loading = true;
  isOfficer = false;

  constructor(
    private landService: LandService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isOfficer = this.authService.isOfficer();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.landService.getById(+id).subscribe({
      next: (l) => { this.land = l; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/lands']); }
    });
  }

  approve(): void {
    if (!this.land) return;
    this.landService.approve(this.land.id).subscribe({
      next: (l) => { this.land = l; this.snackBar.open('Land registration approved!', 'Close', { duration: 3000, panelClass: ['success-snack'] }); },
      error: (err) => this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000 })
    });
  }
}
