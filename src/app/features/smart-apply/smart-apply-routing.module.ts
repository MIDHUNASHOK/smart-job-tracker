import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmartApplyComponent } from './smart-apply.component';

const routes: Routes = [
  {
    path:'',
    component:SmartApplyComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartApplyRoutingModule { }
