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
import { CaseService } from '../../../core/services/case.service';
import { Case } from '../../../core/models/case.model';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule, MatProgressBarModule
  ],
  templateUrl: './case-list.component.html',
  styleUrl: './case-list.component.scss'
})
export class CaseListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['case_number', 'title', 'case_type', 'plaintiff_name', 'defendant_name', 'priority', 'status', 'actions'];
  dataSource = new MatTableDataSource<Case>([]);
  searchControl = new FormControl('');
  loading = true;

  constructor(private caseService: CaseService) {}

  ngOnInit(): void {
    this.loadData();
    this.searchControl.valueChanges.subscribe(val => {
      this.dataSource.filter = (val || '').trim().toLowerCase();
    });
  }

  loadData(): void {
    this.loading = true;
    this.caseService.getAll().subscribe({
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
