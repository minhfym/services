import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TAXES_ROUTES } from './taxes.routes';

@NgModule({
  imports: [RouterModule.forChild(TAXES_ROUTES)],
})
export class TaxesModule {}
