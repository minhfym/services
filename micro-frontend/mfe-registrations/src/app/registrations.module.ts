import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { REGISTRATIONS_ROUTES } from './registrations.routes';

@NgModule({
  imports: [RouterModule.forChild(REGISTRATIONS_ROUTES)],
})
export class RegistrationsModule {}
