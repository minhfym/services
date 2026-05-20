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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TaxService } from '../../../core/services/tax.service';
import { AuthService } from '../../../core/services/auth.service';
import { Tax } from '../../../core/models/tax.model';

@Component({
  selector: 'app-tax-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatChipsModule,
    MatTooltipModule, MatProgressBarModule
  ],
  templateUrl: './tax-list.component.html',
  styleUrl: './tax-list.component.scss'
})
export class TaxListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isOfficer = false;
  isCitizen = false;

  officerColumns = ['taxpayer_name', 'taxpayer_id', 'tax_type', 'amount', 'due_date', 'period', 'status', 'actions'];
  citizenColumns = ['tax_type', 'amount', 'due_date', 'period', 'status', 'actions'];

  get displayedColumns() {
    return this.isCitizen ? this.citizenColumns : this.officerColumns;
  }

  dataSource = new MatTableDataSource<Tax>([]);
  searchControl = new FormControl('');
  loading = true;

  constructor(private taxService: TaxService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isOfficer = this.authService.isOfficer();
    this.isCitizen = this.authService.isCitizen();
    this.loadData();
    this.searchControl.valueChanges.subscribe(val => {
      this.dataSource.filter = (val || '').trim().toLowerCase();
    });
  }

  loadData(): void {
    this.loading = true;
    this.taxService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = Array.isArray(data) ? data : (data as any).data || [];
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
