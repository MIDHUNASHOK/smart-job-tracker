import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CvAnalyticsComponent } from './cv.analytics/cv.analytics.component';

const routes: Routes = [
 {
  path:'',
  component:CvAnalyticsComponent
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
