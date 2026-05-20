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
import { RegistrationService } from '../../../core/services/registration.service';
import { AuthService } from '../../../core/services/auth.service';
import { Registration } from '../../../core/models/registration.model';

@Component({
  selector: 'app-registration-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule, MatProgressBarModule
  ],
  templateUrl: './registration-list.component.html',
  styleUrl: './registration-list.component.scss'
})
export class RegistrationListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isOfficer = false;
  isCitizen = false;

  officerColumns = ['registration_number', 'full_name', 'national_id', 'registration_type', 'submitted_at', 'status', 'actions'];
  citizenColumns = ['registration_number', 'registration_type', 'status', 'submitted_at', 'actions'];

  get displayedColumns() {
    return this.isCitizen ? this.citizenColumns : this.officerColumns;
  }

  dataSource = new MatTableDataSource<Registration>([]);
  searchControl = new FormControl('');
  loading = true;

  constructor(private registrationService: RegistrationService, private authService: AuthService) {}

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
    this.registrationService.getAll().subscribe({
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
