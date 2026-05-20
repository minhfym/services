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
import { GrantService } from '../../../core/services/grant.service';
import { Grant } from '../../../core/models/grant.model';

@Component({
  selector: 'app-grant-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule, MatProgressBarModule
  ],
  templateUrl: './grant-list.component.html',
  styleUrl: './grant-list.component.scss'
})
export class GrantListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['title', 'grant_type', 'total_amount', 'available_amount', 'deadline', 'status', 'actions'];
  dataSource = new MatTableDataSource<Grant>([]);
  searchControl = new FormControl('');
  loading = true;

  constructor(private grantService: GrantService) {}

  ngOnInit(): void {
    this.loadData();
    this.searchControl.valueChanges.subscribe(val => {
      this.dataSource.filter = (val || '').trim().toLowerCase();
    });
  }

  loadData(): void {
    this.loading = true;
    this.grantService.getAll().subscribe({
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
}
