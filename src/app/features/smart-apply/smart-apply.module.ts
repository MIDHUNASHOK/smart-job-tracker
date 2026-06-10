import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartApplyRoutingModule } from './smart-apply-routing.module';
import { SmartApplyComponent } from './smart-apply.component';


@NgModule({
  declarations: [
    SmartApplyComponent
  ],
  imports: [
    CommonModule,
    SmartApplyRoutingModule
  ]
})
export class SmartApplyModule { }
