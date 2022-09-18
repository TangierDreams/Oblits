import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListasEditPageRoutingModule } from './listas-edit-routing.module';

import { ListasEditPage } from './listas-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListasEditPageRoutingModule
  ],
  declarations: [ListasEditPage]
})
export class ListasEditPageModule {}
