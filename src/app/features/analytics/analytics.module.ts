import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { CvAnalyticsComponent } from './cv.analytics/cv.analytics.component';
import { SharedModule } from '../../shared/shared.module';


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
