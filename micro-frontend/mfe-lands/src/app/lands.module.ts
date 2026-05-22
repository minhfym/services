import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LANDS_ROUTES } from './lands.routes';

@NgModule({
  imports: [RouterModule.forChild(LANDS_ROUTES)],
})
export class LandsModule {}
