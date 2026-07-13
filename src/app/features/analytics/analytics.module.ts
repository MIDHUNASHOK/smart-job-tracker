import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { CvAnalyticsComponent } from './cv.analytics/cv.analytics.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CvAnalyticsComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    FormsModule
  ]
})
export class AnalyticsModule { }
