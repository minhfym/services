import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CASES_ROUTES } from './cases.routes';

@NgModule({
  imports: [RouterModule.forChild(CASES_ROUTES)],
})
export class CasesModule {}
