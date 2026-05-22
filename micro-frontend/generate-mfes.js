#!/usr/bin/env node
/**
 * Generates all MFE module files
 */
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/services/micro-frontend';

const COMMON_STYLES = `@import '@angular/material/prebuilt-themes/indigo-pink.css';

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Roboto', sans-serif; background: #f5f5f5; }

.status-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;

  &.pending, &.submitted { background: #fff3e0; color: #e65100; }
  &.approved, &.paid, &.active, &.open { background: #e8f5e9; color: #2e7d32; }
  &.rejected, &.overdue { background: #ffebee; color: #b71c1c; }
  &.under_review, &.processing { background: #e3f2fd; color: #1565c0; }
  &.closed, &.completed { background: #f3e5f5; color: #6a1b9a; }
}
`;

const mfes = [
  {
    dir: 'mfe-permits',
    name: 'permits',
    moduleName: 'PermitsModule',
    routesName: 'PERMITS_ROUTES',
    routesFile: 'permits.routes.ts',
    moduleFile: 'permits.module.ts',
    apiPath: 'permits',
    title: 'E-Permits',
    subtitle: 'Manage permit applications',
    components: [
      {
        name: 'permit-list',
        className: 'PermitListComponent',
        fileName: 'permit-list',
        columns: ['permit_number', 'applicant_name', 'permit_type', 'location', 'status', 'applied_at', 'actions'],
        officerColumns: ['permit_number', 'applicant_name', 'permit_type', 'location', 'status', 'applied_at', 'actions'],
        mockData: [
          `{ id: 1, permit_number: 'PRM-2024-001', applicant_name: 'John Builder', permit_type: 'Construction', location: '123 Main St', status: 'approved', applied_at: '2024-01-15', description: 'New building construction' }`,
          `{ id: 2, permit_number: 'PRM-2024-002', applicant_name: 'Jane Contractor', permit_type: 'Renovation', location: '456 Oak Ave', status: 'pending', applied_at: '2024-02-20', description: 'Office renovation' }`,
          `{ id: 3, permit_number: 'PRM-2024-003', applicant_name: 'Bob Developer', permit_type: 'Demolition', location: '789 Elm St', status: 'under_review', applied_at: '2024-03-10', description: 'Old warehouse demolition' }`,
        ]
      }
    ]
  },
  {
    dir: 'mfe-lands',
    name: 'lands',
    moduleName: 'LandsModule',
    routesName: 'LANDS_ROUTES',
    routesFile: 'lands.routes.ts',
    moduleFile: 'lands.module.ts',
    apiPath: 'lands',
    title: 'Land Administration',
    subtitle: 'Manage land records and registrations',
    components: [
      {
        name: 'land-list',
        className: 'LandListComponent',
        fileName: 'land-list',
        columns: ['plot_number', 'owner_name', 'location', 'area', 'land_use', 'status', 'actions'],
        mockData: [
          `{ id: 1, plot_number: 'PLT-001-2024', owner_name: 'John Landowner', location: 'North District, Block A', area: 2500, land_use: 'Residential', status: 'active', registered_at: '2023-06-01' }`,
          `{ id: 2, plot_number: 'PLT-002-2024', owner_name: 'Jane Property', location: 'South District, Block C', area: 5000, land_use: 'Commercial', status: 'pending', registered_at: '2024-01-10' }`,
          `{ id: 3, plot_number: 'PLT-003-2024', owner_name: 'Bob Farmer', location: 'East District, Rural Zone', area: 15000, land_use: 'Agricultural', status: 'active', registered_at: '2022-11-15' }`,
        ]
      }
    ]
  },
  {
    dir: 'mfe-grants',
    name: 'grants',
    moduleName: 'GrantsModule',
    routesName: 'GRANTS_ROUTES',
    routesFile: 'grants.routes.ts',
    moduleFile: 'grants.module.ts',
    apiPath: 'grants',
    title: 'Grants Management',
    subtitle: 'Available grants and applications',
    components: [
      {
        name: 'grant-list',
        className: 'GrantListComponent',
        fileName: 'grant-list',
        columns: ['grant_code', 'title', 'category', 'amount', 'deadline', 'status', 'actions'],
        mockData: [
          `{ id: 1, grant_code: 'GRT-2024-001', title: 'Small Business Development Grant', category: 'Business', amount: 25000, deadline: '2024-12-31', status: 'open', description: 'Supporting small business growth' }`,
          `{ id: 2, grant_code: 'GRT-2024-002', title: 'Agricultural Innovation Fund', category: 'Agriculture', amount: 50000, deadline: '2024-09-30', status: 'open', description: 'Modern farming techniques' }`,
          `{ id: 3, grant_code: 'GRT-2024-003', title: 'Youth Entrepreneurship Grant', category: 'Youth', amount: 10000, deadline: '2024-06-30', status: 'closed', description: 'Supporting young entrepreneurs' }`,
        ]
      }
    ]
  },
  {
    dir: 'mfe-cases',
    name: 'cases',
    moduleName: 'CasesModule',
    routesName: 'CASES_ROUTES',
    routesFile: 'cases.routes.ts',
    moduleFile: 'cases.module.ts',
    apiPath: 'cases',
    title: 'Law Cases',
    subtitle: 'Manage and track legal cases',
    components: [
      {
        name: 'case-list',
        className: 'CaseListComponent',
        fileName: 'case-list',
        columns: ['case_number', 'title', 'case_type', 'priority', 'assigned_officer', 'status', 'filed_at', 'actions'],
        mockData: [
          `{ id: 1, case_number: 'CASE-2024-001', title: 'Property Dispute Resolution', case_type: 'Civil', priority: 'high', assigned_officer: 'Officer Williams', status: 'open', filed_at: '2024-01-15', description: 'Boundary dispute between neighbors' }`,
          `{ id: 2, case_number: 'CASE-2024-002', title: 'Business License Violation', case_type: 'Administrative', priority: 'medium', assigned_officer: 'Officer Johnson', status: 'under_review', filed_at: '2024-02-10', description: 'Operating without proper license' }`,
          `{ id: 3, case_number: 'CASE-2024-003', title: 'Tax Evasion Investigation', case_type: 'Criminal', priority: 'high', assigned_officer: 'Officer Davis', status: 'processing', filed_at: '2024-03-05', description: 'Suspected tax fraud case' }`,
        ]
      }
    ]
  },
  {
    dir: 'mfe-registrations',
    name: 'registrations',
    moduleName: 'RegistrationsModule',
    routesName: 'REGISTRATIONS_ROUTES',
    routesFile: 'registrations.routes.ts',
    moduleFile: 'registrations.module.ts',
    apiPath: 'registrations',
    title: 'Citizen Registrations',
    subtitle: 'Manage citizen registration records',
    components: [
      {
        name: 'registration-list',
        className: 'RegistrationListComponent',
        fileName: 'registration-list',
        columns: ['registration_number', 'citizen_name', 'registration_type', 'national_id', 'status', 'submitted_at', 'actions'],
        mockData: [
          `{ id: 1, registration_number: 'REG-2024-001', citizen_name: 'Alice Newborn', registration_type: 'Birth Certificate', national_id: 'N/A', status: 'approved', submitted_at: '2024-01-20', notes: 'Birth registration for newborn' }`,
          `{ id: 2, registration_number: 'REG-2024-002', citizen_name: 'Bob Marriage', registration_type: 'Marriage Certificate', national_id: 'ID-123456', status: 'pending', submitted_at: '2024-02-14', notes: 'Marriage registration' }`,
          `{ id: 3, registration_number: 'REG-2024-003', citizen_name: 'Carol Student', registration_type: 'Education Record', national_id: 'ID-789012', status: 'under_review', submitted_at: '2024-03-01', notes: 'University enrollment record' }`,
        ]
      }
    ]
  }
];

function generateRoutesFile(mfe) {
  const compName = mfe.components[0].className.replace('ListComponent', '');
  const lower = mfe.name;
  return `import { Routes } from '@angular/router';

export const ${mfe.routesName}: Routes = [
  {
    path: '',
    loadComponent: () => import('./${mfe.components[0].fileName}/${mfe.components[0].fileName}.component').then(m => m.${mfe.components[0].className})
  },
  {
    path: 'new',
    loadComponent: () => import('./${lower}-form/${lower}-form.component').then(m => m.${compName}FormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./${lower}-detail/${lower}-detail.component').then(m => m.${compName}DetailComponent)
  },
];
`;
}

function generateModuleFile(mfe) {
  return `import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ${mfe.routesName} } from './${mfe.routesFile.replace('.ts', '')}';

@NgModule({
  imports: [RouterModule.forChild(${mfe.routesName})],
})
export class ${mfe.moduleName} {}
`;
}

function generateListComponent(mfe, comp) {
  const entitySingular = mfe.name.slice(0, -1); // Remove trailing 's'
  return `import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
  selector: 'app-${comp.fileName}',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatFormFieldModule, MatButtonModule,
    MatIconModule, MatCardModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  template: \`
    <div class="mfe-container">
      <div class="page-header">
        <div>
          <h2>${mfe.title}</h2>
          <p class="subtitle">${mfe.subtitle}</p>
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
  \`,
  styles: [\`
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
  \`]
})
export class ${comp.className} implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  searchCtrl = new FormControl('');
  loading = false;
  isOfficer = false;

  allColumns = ${JSON.stringify(comp.columns.filter(c => c !== 'actions').map(c => ({
    key: c,
    label: c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    type: c === comp.columns[0] ? 'link' : c === 'status' ? 'badge' : c === 'amount' ? 'currency' : c.includes('_at') || c.includes('_date') || c === 'deadline' ? 'date' : 'text'
  })), null, 2)};

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
    const headers: any = token ? { Authorization: \`Bearer \${token}\` } : {};
    this.http.get<any>('http://localhost:8000/api/${mfe.apiPath}', { headers }).subscribe({
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
      ${comp.mockData.join(',\n      ')}
    ];
  }
}
`;
}

function generateFormComponent(mfe) {
  const compName = mfe.name.slice(0, -1);
  const compClassName = compName.charAt(0).toUpperCase() + compName.slice(1);
  return `import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-${compName}-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSelectModule, MatProgressBarModule, MatSnackBarModule
  ],
  template: \`
    <div class="mfe-container">
      <div class="page-header">
        <button mat-icon-button routerLink="../">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h2>{{ editId ? 'Edit' : 'New' }} ${mfe.title.slice(0, -1)} Record</h2>
          <p class="subtitle">Fill in the details below</p>
        </div>
      </div>
      <mat-card class="form-card">
        <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()" class="record-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title / Name</mat-label>
              <input matInput formControlName="title" placeholder="Enter title or name">
              <mat-error *ngIf="form.get('title')?.hasError('required')">Required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="4" placeholder="Detailed description..."></textarea>
            </mat-form-field>

            <div class="error-message" *ngIf="error">
              <mat-icon>error_outline</mat-icon>
              <span>{{ error }}</span>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="../">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="loading || form.invalid">
                <mat-icon>save</mat-icon>
                {{ editId ? 'Update' : 'Create' }} Record
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  \`,
  styles: [\`
    .mfe-container { padding: 0; }
    .page-header {
      display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
      h2 { font-size: 22px; font-weight: 700; color: #1a237e; margin: 0 0 4px; }
      .subtitle { font-size: 13px; color: #757575; margin: 0; }
    }
    .form-card { border-radius: 12px !important; }
    .record-form { padding: 8px 0; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .error-message {
      display: flex; align-items: center; gap: 8px;
      color: #c62828; margin-bottom: 16px;
      padding: 10px 14px; background: #ffebee; border-radius: 6px;
    }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
  \`]
})
export class ${compClassName}FormComponent implements OnInit {
  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
  });

  loading = false;
  error = '';
  editId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) this.loadRecord(this.editId);
  }

  loadRecord(id: string): void {
    this.loading = true;
    const token = localStorage.getItem('gov_token');
    const headers: any = token ? { Authorization: \`Bearer \${token}\` } : {};
    this.http.get<any>(\`http://localhost:8000/api/${mfe.apiPath}/\${id}\`, { headers }).subscribe({
      next: (rec) => { this.form.patchValue(rec); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const token = localStorage.getItem('gov_token');
    const headers: any = token ? { Authorization: \`Bearer \${token}\` } : {};
    const url = this.editId
      ? \`http://localhost:8000/api/${mfe.apiPath}/\${this.editId}\`
      : 'http://localhost:8000/api/${mfe.apiPath}';
    const req = this.editId
      ? this.http.put(url, this.form.value, { headers })
      : this.http.post(url, this.form.value, { headers });

    req.subscribe({
      next: () => {
        this.snackBar.open('Record saved successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Failed to save record.';
        this.loading = false;
      }
    });
  }
}
`;
}

function generateDetailComponent(mfe) {
  const compName = mfe.name.slice(0, -1);
  const compClassName = compName.charAt(0).toUpperCase() + compName.slice(1);
  const firstComp = mfe.components[0];
  const idField = firstComp.columns[0]; // e.g., permit_number
  const mock = firstComp.mockData[0];

  return `import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-${compName}-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, HttpClientModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDividerModule,
    MatSnackBarModule, MatChipsModule
  ],
  template: \`
    <div class="mfe-container">
      <div class="page-header">
        <button mat-icon-button routerLink="../">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h2>${mfe.title.replace(/s$/, '')} Details</h2>
          <p class="subtitle" *ngIf="record">{{ record['${idField}'] }}</p>
        </div>
        <div class="header-actions" *ngIf="record && isOfficer">
          <button mat-stroked-button color="warn" *ngIf="record.status === 'pending' || record.status === 'under_review'" (click)="updateStatus('rejected')">
            <mat-icon>close</mat-icon> Reject
          </button>
          <button mat-raised-button color="primary" *ngIf="record.status === 'pending' || record.status === 'under_review'" (click)="updateStatus('approved')">
            <mat-icon>check</mat-icon> Approve
          </button>
        </div>
      </div>

      <div class="loading-wrapper" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && record">
        <mat-card class="detail-card">
          <mat-card-header>
            <mat-card-title>Record Information</mat-card-title>
            <span class="status-badge" [ngClass]="record.status" style="margin-left: auto">{{ record.status }}</span>
          </mat-card-header>
          <mat-card-content>
            <div *ngFor="let field of getDisplayFields()" class="detail-row">
              <span class="label">{{ field.label }}</span>
              <span class="value">
                <ng-container [ngSwitch]="field.type">
                  <span *ngSwitchCase="'currency'">{{ record[field.key] | currency }}</span>
                  <span *ngSwitchCase="'date'">{{ record[field.key] | date:'longDate' }}</span>
                  <span *ngSwitchCase="'badge'" class="status-badge" [ngClass]="record[field.key]">{{ record[field.key] }}</span>
                  <span *ngSwitchDefault>{{ record[field.key] }}</span>
                </ng-container>
              </span>
              <mat-divider></mat-divider>
            </div>

            <div class="detail-row" *ngIf="record.description || record.notes">
              <span class="label">Description / Notes</span>
              <span class="value">{{ record.description || record.notes }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  \`,
  styles: [\`
    .mfe-container { padding: 0; }
    .page-header {
      display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
      h2 { font-size: 22px; font-weight: 700; color: #1a237e; margin: 0 0 4px; }
      .subtitle { font-size: 13px; color: #757575; margin: 0; }
      .header-actions { margin-left: auto; display: flex; gap: 8px; }
    }
    .loading-wrapper { display: flex; justify-content: center; padding: 40px; }
    .detail-card { border-radius: 12px !important; }
    .detail-row { padding: 12px 0; font-size: 14px; }
    .label { color: #757575; display: block; font-size: 12px; margin-bottom: 4px; }
    .value { font-weight: 500; color: #212121; }
    .status-badge {
      padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; display: inline-block;
      &.pending, &.submitted { background: #fff3e0; color: #e65100; }
      &.approved, &.paid, &.active, &.open { background: #e8f5e9; color: #2e7d32; }
      &.rejected, &.overdue { background: #ffebee; color: #b71c1c; }
      &.under_review, &.processing { background: #e3f2fd; color: #1565c0; }
      &.closed, &.completed { background: #f3e5f5; color: #6a1b9a; }
    }
  \`]
})
export class ${compClassName}DetailComponent implements OnInit {
  record: any = null;
  loading = false;
  isOfficer = false;
  isCitizen = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('gov_user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.isOfficer = user?.role === 'officer' || user?.role === 'admin';
    this.isCitizen = user?.role === 'citizen';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadRecord(id);
  }

  loadRecord(id: string): void {
    this.loading = true;
    const token = localStorage.getItem('gov_token');
    const headers: any = token ? { Authorization: \`Bearer \${token}\` } : {};
    this.http.get<any>(\`http://localhost:8000/api/${mfe.apiPath}/\${id}\`, { headers }).subscribe({
      next: (res) => { this.record = res; this.loading = false; },
      error: () => {
        this.record = ${firstComp.mockData[0]};
        this.loading = false;
      }
    });
  }

  getDisplayFields(): any[] {
    if (!this.record) return [];
    const skip = ['id', 'description', 'notes', 'status'];
    return Object.keys(this.record)
      .filter(k => !skip.includes(k))
      .map(k => ({
        key: k,
        label: k.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        type: k.includes('amount') || k.includes('price') ? 'currency'
             : k.includes('_at') || k.includes('_date') || k === 'deadline' ? 'date'
             : 'text'
      }));
  }

  updateStatus(status: string): void {
    const token = localStorage.getItem('gov_token');
    const headers: any = token ? { Authorization: \`Bearer \${token}\` } : {};
    this.http.patch(\`http://localhost:8000/api/${mfe.apiPath}/\${this.record.id}\`, { status }, { headers }).subscribe({
      next: () => {
        this.record.status = status;
        this.snackBar.open(\`Record \${status} successfully!\`, 'Close', { duration: 3000 });
      },
      error: () => {
        this.record.status = status; // Optimistic update for demo
        this.snackBar.open(\`Status updated to \${status}\`, 'Close', { duration: 3000 });
      }
    });
  }
}
`;
}

// Generate files for each MFE
for (const mfe of mfes) {
  const projectDir = path.join(BASE, mfe.dir);
  const appDir = path.join(projectDir, 'src/app');

  // Update styles.scss
  const stylesPath = path.join(projectDir, 'src/styles.scss');
  if (fs.existsSync(stylesPath)) {
    fs.writeFileSync(stylesPath, COMMON_STYLES);
    console.log(`Updated styles.scss for ${mfe.dir}`);
  }

  // Create routes file
  fs.writeFileSync(path.join(appDir, mfe.routesFile), generateRoutesFile(mfe));
  console.log(`Created ${mfe.routesFile} for ${mfe.dir}`);

  // Create module file
  fs.writeFileSync(path.join(appDir, mfe.moduleFile), generateModuleFile(mfe));
  console.log(`Created ${mfe.moduleFile} for ${mfe.dir}`);

  // Create list component
  const comp = mfe.components[0];
  const compDir = path.join(appDir, comp.fileName);
  fs.mkdirSync(compDir, { recursive: true });
  fs.writeFileSync(path.join(compDir, `${comp.fileName}.component.ts`), generateListComponent(mfe, comp));
  console.log(`Created ${comp.fileName}.component.ts for ${mfe.dir}`);

  // Create form component
  const formDir = path.join(appDir, `${mfe.name.slice(0,-1)}-form`);
  fs.mkdirSync(formDir, { recursive: true });
  fs.writeFileSync(path.join(formDir, `${mfe.name.slice(0,-1)}-form.component.ts`), generateFormComponent(mfe));
  console.log(`Created ${mfe.name.slice(0,-1)}-form.component.ts for ${mfe.dir}`);

  // Create detail component
  const detailDir = path.join(appDir, `${mfe.name.slice(0,-1)}-detail`);
  fs.mkdirSync(detailDir, { recursive: true });
  fs.writeFileSync(path.join(detailDir, `${mfe.name.slice(0,-1)}-detail.component.ts`), generateDetailComponent(mfe));
  console.log(`Created ${mfe.name.slice(0,-1)}-detail.component.ts for ${mfe.dir}`);
}

console.log('\nAll MFE files generated!');
