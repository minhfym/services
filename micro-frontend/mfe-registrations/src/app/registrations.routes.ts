import { Routes } from '@angular/router';

export const REGISTRATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./registration-list/registration-list.component').then(m => m.RegistrationListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./registration-form/registration-form.component').then(m => m.RegistrationFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./registration-detail/registration-detail.component').then(m => m.RegistrationDetailComponent)
  },
];
