import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// Helper to load remote MFE with fallback
function loadRemote(remoteName: string, exposedModule: string, fallbackFn: () => Promise<any>): () => Promise<any> {
  return () => {
    const loadFn = new Function('return import("' + remoteName + '/' + exposedModule + '")');
    return loadFn().catch(fallbackFn);
  };
}

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
        loadChildren: loadRemote('mfeTaxes', 'Module',
          () => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
      {
        path: 'permits',
        loadChildren: loadRemote('mfePermits', 'Module',
          () => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
      {
        path: 'lands',
        loadChildren: loadRemote('mfeLands', 'Module',
          () => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
      {
        path: 'grants',
        loadChildren: loadRemote('mfeGrants', 'Module',
          () => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
      {
        path: 'cases',
        loadChildren: loadRemote('mfeCases', 'Module',
          () => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
      {
        path: 'registrations',
        loadChildren: loadRemote('mfeRegistrations', 'Module',
          () => import('./features/fallback/fallback.module').then(m => m.FallbackModule))
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
