import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListasEditPage } from './listas-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ListasEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListasEditPageRoutingModule {}
