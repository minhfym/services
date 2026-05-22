import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-registration-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatFormFieldModule, MatButtonModule,
    MatIconModule, MatCardModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <div class="mfe-container">
      <div class="page-header">
        <div>
          <h2>Citizen Registrations</h2>
          <p class="subtitle">Manage citizen registration records</p>
        </div>
        <button mat-raised-button color="primary" *ngIf="isOfficer" routerLink="new">
          <mat-icon>add</mat-icon> New Record
        </button>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-controls">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search records...</mat-label>
              <input matInput [formControl]="searchCtrl" placeholder="Search...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div class="loading-wrapper" *ngIf="loading">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <div *ngIf="!loading">
            <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
              <ng-container *ngFor="let col of allColumns" [matColumnDef]="col.key">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ col.label }}</th>
                <td mat-cell *matCellDef="let row">
                  <ng-container [ngSwitch]="col.type">
                    <a *ngSwitchCase="'link'" [routerLink]="[row.id]" class="link-cell">{{ row[col.key] }}</a>
                    <span *ngSwitchCase="'badge'" class="status-badge" [ngClass]="row[col.key]">{{ row[col.key] }}</span>
                    <span *ngSwitchCase="'currency'">{{ row[col.key] | currency }}</span>
                    <span *ngSwitchCase="'date'">{{ row[col.key] | date:'mediumDate' }}</span>
                    <span *ngSwitchDefault>{{ row[col.key] }}</span>
                  </ng-container>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let row">
                  <button mat-icon-button [routerLink]="[row.id]" matTooltip="View details">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button *ngIf="isOfficer" [routerLink]="['edit', row.id]" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">No records found</td>
              </tr>
            </table>
            <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .mfe-container { padding: 0; }
    .page-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
      h2 { font-size: 22px; font-weight: 700; color: #1a237e; margin: 0 0 4px; }
      .subtitle { font-size: 13px; color: #757575; margin: 0; }
    }
    .table-card { border-radius: 12px !important; }
    .table-controls { margin-bottom: 16px; }
    .search-field { width: 320px; }
    .full-width-table { width: 100%; }
    .loading-wrapper { display: flex; justify-content: center; padding: 40px; }
    .link-cell { color: #1a237e; text-decoration: none; font-weight: 600; &:hover { text-decoration: underline; } }
    .no-data { text-align: center; padding: 32px; color: #9e9e9e; }
    .status-badge {
      padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; display: inline-block;
      &.pending, &.submitted { background: #fff3e0; color: #e65100; }
      &.approved, &.paid, &.active, &.open { background: #e8f5e9; color: #2e7d32; }
      &.rejected, &.overdue { background: #ffebee; color: #b71c1c; }
      &.under_review, &.processing { background: #e3f2fd; color: #1565c0; }
      &.closed, &.completed { background: #f3e5f5; color: #6a1b9a; }
    }
  `]
})
export class RegistrationListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  searchCtrl = new FormControl('');
  loading = false;
  isOfficer = false;

  allColumns = [
  {
    "key": "registration_number",
    "label": "Registration Number",
    "type": "link"
  },
  {
    "key": "citizen_name",
    "label": "Citizen Name",
    "type": "text"
  },
  {
    "key": "registration_type",
    "label": "Registration Type",
    "type": "text"
  },
  {
    "key": "national_id",
    "label": "National Id",
    "type": "text"
  },
  {
    "key": "status",
    "label": "Status",
    "type": "badge"
  },
  {
    "key": "submitted_at",
    "label": "Submitted At",
    "type": "date"
  }
];

  get displayedColumns(): string[] {
    return [...this.allColumns.map(c => c.key), 'actions'];
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('gov_user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.isOfficer = user?.role === 'officer' || user?.role === 'admin';
    this.loadData();

    this.searchCtrl.valueChanges.pipe(
      debounceTime(300), distinctUntilChanged()
    ).subscribe(val => {
      this.dataSource.filter = (val || '').trim().toLowerCase();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(): void {
    this.loading = true;
    const token = localStorage.getItem('gov_token');
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
    this.http.get<any>('http://localhost:8000/api/registrations', { headers }).subscribe({
      next: (res) => {
        this.dataSource.data = res.data || res || [];
        this.loading = false;
      },
      error: () => {
        this.dataSource.data = this.getMockData();
        this.loading = false;
      }
    });
  }

  getMockData(): any[] {
    return [
      { id: 1, registration_number: 'REG-2024-001', citizen_name: 'Alice Newborn', registration_type: 'Birth Certificate', national_id: 'N/A', status: 'approved', submitted_at: '2024-01-20', notes: 'Birth registration for newborn' },
      { id: 2, registration_number: 'REG-2024-002', citizen_name: 'Bob Marriage', registration_type: 'Marriage Certificate', national_id: 'ID-123456', status: 'pending', submitted_at: '2024-02-14', notes: 'Marriage registration' },
      { id: 3, registration_number: 'REG-2024-003', citizen_name: 'Carol Student', registration_type: 'Education Record', national_id: 'ID-789012', status: 'under_review', submitted_at: '2024-03-01', notes: 'University enrollment record' }
    ];
  }
}
