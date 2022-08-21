import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsEditPageRoutingModule } from './items-edit-routing.module';

import { ItemsEditPage } from './items-edit.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ItemsEditPageRoutingModule
    ],
    declarations: [ItemsEditPage]
})
export class ItemsEditPageModule { }
