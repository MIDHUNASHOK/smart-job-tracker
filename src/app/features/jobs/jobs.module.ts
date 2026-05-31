import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobListComponent } from './job-list/job-list.component';
import { AddJobComponent } from './add-job/add-job.component';
import { EditJobComponent } from './edit-job/edit-job.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    JobListComponent,
    AddJobComponent,
    EditJobComponent
  ],
  imports: [
    CommonModule,
    JobsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ]
})
export class JobsModule { }
