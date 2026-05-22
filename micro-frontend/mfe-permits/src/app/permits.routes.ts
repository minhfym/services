import { Routes } from '@angular/router';

export const PERMITS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./permit-list/permit-list.component').then(m => m.PermitListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./permit-form/permit-form.component').then(m => m.PermitFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./permit-detail/permit-detail.component').then(m => m.PermitDetailComponent)
  },
];
