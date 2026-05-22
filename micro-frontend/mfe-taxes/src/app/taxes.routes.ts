import { Routes } from '@angular/router';

export const TAXES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tax-list/tax-list.component').then(m => m.TaxListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./tax-form/tax-form.component').then(m => m.TaxFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./tax-detail/tax-detail.component').then(m => m.TaxDetailComponent)
  },
];
