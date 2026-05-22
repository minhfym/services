import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'taxes',
        loadChildren: () => (import('mfeTaxes/Module') as any)
          .then((m: any) => m.TaxesModule)
          .catch(() => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
      {
        path: 'permits',
        loadChildren: () => (import('mfePermits/Module') as any)
          .then((m: any) => m.PermitsModule)
          .catch(() => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
      {
        path: 'lands',
        loadChildren: () => (import('mfeLands/Module') as any)
          .then((m: any) => m.LandsModule)
          .catch(() => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
      {
        path: 'grants',
        loadChildren: () => (import('mfeGrants/Module') as any)
          .then((m: any) => m.GrantsModule)
          .catch(() => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
      {
        path: 'cases',
        loadChildren: () => (import('mfeCases/Module') as any)
          .then((m: any) => m.CasesModule)
          .catch(() => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
      {
        path: 'registrations',
        loadChildren: () => (import('mfeRegistrations/Module') as any)
          .then((m: any) => m.RegistrationsModule)
          .catch(() => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
