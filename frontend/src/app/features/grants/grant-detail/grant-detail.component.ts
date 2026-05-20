import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GrantService } from '../../../core/services/grant.service';
import { Grant } from '../../../core/models/grant.model';

@Component({
  selector: 'app-grant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatProgressBarModule],
  templateUrl: './grant-detail.component.html',
  styleUrl: './grant-detail.component.scss'
})
export class GrantDetailComponent implements OnInit {
  grant: Grant | null = null;
  loading = true;

  constructor(
    private grantService: GrantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.grantService.getById(+id).subscribe({
      next: (g) => { this.grant = g; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/grants']); }
    });
  }
}
