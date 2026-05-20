import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TaxListComponent } from './features/taxes/tax-list/tax-list.component';
import { TaxFormComponent } from './features/taxes/tax-form/tax-form.component';
import { TaxDetailComponent } from './features/taxes/tax-detail/tax-detail.component';
import { PermitListComponent } from './features/permits/permit-list/permit-list.component';
import { PermitFormComponent } from './features/permits/permit-form/permit-form.component';
import { PermitDetailComponent } from './features/permits/permit-detail/permit-detail.component';
import { LandListComponent } from './features/lands/land-list/land-list.component';
import { LandFormComponent } from './features/lands/land-form/land-form.component';
import { LandDetailComponent } from './features/lands/land-detail/land-detail.component';
import { GrantListComponent } from './features/grants/grant-list/grant-list.component';
import { GrantFormComponent } from './features/grants/grant-form/grant-form.component';
import { GrantDetailComponent } from './features/grants/grant-detail/grant-detail.component';
import { GrantApplicationListComponent } from './features/grants/grant-application-list/grant-application-list.component';
import { CaseListComponent } from './features/cases/case-list/case-list.component';
import { CaseFormComponent } from './features/cases/case-form/case-form.component';
import { CaseDetailComponent } from './features/cases/case-detail/case-detail.component';
import { RegistrationListComponent } from './features/registrations/registration-list/registration-list.component';
import { RegistrationFormComponent } from './features/registrations/registration-form/registration-form.component';
import { RegistrationDetailComponent } from './features/registrations/registration-detail/registration-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'taxes', component: TaxListComponent },
      { path: 'taxes/new', component: TaxFormComponent },
      { path: 'taxes/:id', component: TaxDetailComponent },
      { path: 'permits', component: PermitListComponent },
      { path: 'permits/new', component: PermitFormComponent },
      { path: 'permits/:id', component: PermitDetailComponent },
      { path: 'lands', component: LandListComponent },
      { path: 'lands/new', component: LandFormComponent },
      { path: 'lands/:id', component: LandDetailComponent },
      { path: 'grants', component: GrantListComponent },
      { path: 'grants/new', component: GrantFormComponent },
      { path: 'grants/:id', component: GrantDetailComponent },
      { path: 'grant-applications', component: GrantApplicationListComponent },
      { path: 'cases', component: CaseListComponent },
      { path: 'cases/new', component: CaseFormComponent },
      { path: 'cases/:id', component: CaseDetailComponent },
      { path: 'registrations', component: RegistrationListComponent },
      { path: 'registrations/new', component: RegistrationFormComponent },
      { path: 'registrations/:id', component: RegistrationDetailComponent },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
