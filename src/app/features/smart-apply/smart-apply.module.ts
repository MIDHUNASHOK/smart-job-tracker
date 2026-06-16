import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartApplyRoutingModule } from './smart-apply-routing.module';
import { SmartApplyComponent } from './smart-apply.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SmartApplyComponent
  ],
  imports: [
    CommonModule,
    SmartApplyRoutingModule,
    ReactiveFormsModule
  ]
})
export class SmartApplyModule { }
