import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GrantService } from '../../../core/services/grant.service';
import { AuthService } from '../../../core/services/auth.service';
import { GrantApplication } from '../../../core/models/grant.model';

@Component({
  selector: 'app-grant-application-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule,
    MatProgressBarModule, MatSnackBarModule
  ],
  templateUrl: './grant-application-list.component.html',
  styleUrl: './grant-application-list.component.scss'
})
export class GrantApplicationListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['applicant_name', 'grant_title', 'organization', 'requested_amount', 'submitted_at', 'status', 'actions'];
  dataSource = new MatTableDataSource<GrantApplication>([]);
  searchControl = new FormControl('');
  loading = true;
  isOfficer = false;

  constructor(
    private grantService: GrantService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isOfficer = this.authService.isOfficer();
    this.loadData();
    this.searchControl.valueChanges.subscribe(val => {
      this.dataSource.filter = (val || '').trim().toLowerCase();
    });
  }

  loadData(): void {
    this.loading = true;
    this.grantService.getAllApplications().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  approve(id: number): void {
    this.grantService.approveApplication(id).subscribe({
      next: () => {
        this.snackBar.open('Application approved!', 'Close', { duration: 3000, panelClass: ['success-snack'] });
        this.loadData();
      },
      error: (err) => this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000 })
    });
  }

  reject(id: number): void {
    this.grantService.rejectApplication(id, 'Rejected by officer').subscribe({
      next: () => {
        this.snackBar.open('Application rejected', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: (err) => this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000 })
    });
  }
}
