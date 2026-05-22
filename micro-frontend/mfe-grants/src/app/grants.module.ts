import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GRANTS_ROUTES } from './grants.routes';

@NgModule({
  imports: [RouterModule.forChild(GRANTS_ROUTES)],
})
export class GrantsModule {}
