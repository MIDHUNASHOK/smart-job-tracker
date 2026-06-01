import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { CvAnalyticsComponent } from './cv.analytics/cv.analytics.component';


@NgModule({
  declarations: [
    CvAnalyticsComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule { }
