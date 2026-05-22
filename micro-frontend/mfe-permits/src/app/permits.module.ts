import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PERMITS_ROUTES } from './permits.routes';

@NgModule({
  imports: [RouterModule.forChild(PERMITS_ROUTES)],
})
export class PermitsModule {}
