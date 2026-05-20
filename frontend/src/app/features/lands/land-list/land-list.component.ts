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
import { LandService } from '../../../core/services/land.service';
import { Land } from '../../../core/models/land.model';

@Component({
  selector: 'app-land-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule, MatProgressBarModule
  ],
  templateUrl: './land-list.component.html',
  styleUrl: './land-list.component.scss'
})
export class LandListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['parcel_number', 'owner_name', 'location', 'district', 'area_sqm', 'land_use', 'status', 'actions'];
  dataSource = new MatTableDataSource<Land>([]);
  searchControl = new FormControl('');
  loading = true;

  constructor(private landService: LandService) {}

  ngOnInit(): void {
    this.loadData();
    this.searchControl.valueChanges.subscribe(val => {
      this.dataSource.filter = (val || '').trim().toLowerCase();
    });
  }

  loadData(): void {
    this.loading = true;
    this.landService.getAll().subscribe({
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
