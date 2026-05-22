import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface TaxRecord {
  id: number;
  tax_number: string;
  taxpayer_name: string;
  taxpayer_email: string;
  tax_type: string;
  amount: number;
  paid_amount: number;
  status: string;
  due_date: string;
  created_at: string;
}

@Component({
  selector: 'app-tax-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatFormFieldModule, MatButtonModule,
    MatIconModule, MatCardModule, MatChipsModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <div class="mfe-container">
      <div class="page-header">
        <div>
          <h2>Tax Collection</h2>
          <p class="subtitle">Manage and track tax records</p>
        </div>
        <button mat-raised-button color="primary" *ngIf="isOfficer" routerLink="new">
          <mat-icon>add</mat-icon> New Tax Record
        </button>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-controls">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search tax records</mat-label>
              <input matInput [formControl]="searchCtrl" placeholder="Tax #, name, type...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div class="loading-wrapper" *ngIf="loading">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <div *ngIf="!loading">
            <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
              <ng-container matColumnDef="tax_number">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Tax #</th>
                <td mat-cell *matCellDef="let row">
                  <a [routerLink]="[row.id]" class="link-cell">{{ row.tax_number }}</a>
                </td>
              </ng-container>

              <ng-container matColumnDef="taxpayer_name" *ngIf="isOfficer">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Taxpayer</th>
                <td mat-cell *matCellDef="let row">{{ row.taxpayer_name }}</td>
              </ng-container>

              <ng-container matColumnDef="tax_type">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
                <td mat-cell *matCellDef="let row">{{ row.tax_type }}</td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
                <td mat-cell *matCellDef="let row">{{ row.amount | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="paid_amount">
                <th mat-header-cell *matHeaderCellDef>Paid</th>
                <td mat-cell *matCellDef="let row">{{ row.paid_amount | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="due_date">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Due Date</th>
                <td mat-cell *matCellDef="let row">{{ row.due_date | date:'mediumDate' }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let row">
                  <span class="status-badge" [ngClass]="row.status">{{ row.status }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let row">
                  <button mat-icon-button [routerLink]="[row.id]" matTooltip="View details">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button *ngIf="isOfficer" [routerLink]="[row.id, 'edit']" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">
                  No records found
                </td>
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
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 20px;
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
      padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;
      &.pending { background: #fff3e0; color: #e65100; }
      &.paid { background: #e8f5e9; color: #2e7d32; }
      &.overdue { background: #ffebee; color: #b71c1c; }
      &.processing { background: #e3f2fd; color: #1565c0; }
      &.partially_paid { background: #fce4ec; color: #880e4f; }
    }
  `]
})
export class TaxListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<TaxRecord>([]);
  searchCtrl = new FormControl('');
  loading = false;
  isOfficer = false;

  get displayedColumns(): string[] {
    const base = ['tax_number', 'tax_type', 'amount', 'paid_amount', 'due_date', 'status', 'actions'];
    if (this.isOfficer) base.splice(1, 0, 'taxpayer_name');
    return base;
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('gov_user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.isOfficer = user?.role === 'officer' || user?.role === 'admin';
    this.loadData();

    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
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
    this.http.get<any>('http://localhost:8000/api/taxes', { headers }).subscribe({
      next: (res) => {
        this.dataSource.data = res.data || res || [];
        this.loading = false;
      },
      error: () => {
        // Show mock data when API is unavailable
        this.dataSource.data = this.getMockData();
        this.loading = false;
      }
    });
  }

  getMockData(): TaxRecord[] {
    return [
      { id: 1, tax_number: 'TAX-2024-001', taxpayer_name: 'John Doe', taxpayer_email: 'john@example.com', tax_type: 'Income Tax', amount: 5000, paid_amount: 5000, status: 'paid', due_date: '2024-04-15', created_at: '2024-01-01' },
      { id: 2, tax_number: 'TAX-2024-002', taxpayer_name: 'Jane Smith', taxpayer_email: 'jane@example.com', tax_type: 'Property Tax', amount: 2500, paid_amount: 0, status: 'pending', due_date: '2024-12-31', created_at: '2024-01-15' },
      { id: 3, tax_number: 'TAX-2024-003', taxpayer_name: 'Bob Johnson', taxpayer_email: 'bob@example.com', tax_type: 'Business Tax', amount: 8000, paid_amount: 0, status: 'overdue', due_date: '2024-03-31', created_at: '2024-02-01' },
      { id: 4, tax_number: 'TAX-2024-004', taxpayer_name: 'Alice Brown', taxpayer_email: 'alice@example.com', tax_type: 'Income Tax', amount: 3200, paid_amount: 1600, status: 'partially_paid', due_date: '2024-06-30', created_at: '2024-03-01' },
    ];
  }
}
