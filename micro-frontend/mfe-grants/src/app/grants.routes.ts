import { Routes } from '@angular/router';

export const GRANTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./grant-list/grant-list.component').then(m => m.GrantListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./grant-form/grant-form.component').then(m => m.GrantFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./grant-detail/grant-detail.component').then(m => m.GrantDetailComponent)
  },
];
