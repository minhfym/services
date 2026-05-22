import { Routes } from '@angular/router';

export const LANDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./land-list/land-list.component').then(m => m.LandListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./land-form/land-form.component').then(m => m.LandFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./land-detail/land-detail.component').then(m => m.LandDetailComponent)
  },
];
