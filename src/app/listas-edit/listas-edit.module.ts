import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListasEditPageRoutingModule } from './listas-edit-routing.module';

import { ListasEditPage } from './listas-edit.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ListasEditPageRoutingModule
    ],
    declarations: [ListasEditPage]
})
export class ListasEditPageModule { }
