import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsEditPage } from './items-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ItemsEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsEditPageRoutingModule {}
