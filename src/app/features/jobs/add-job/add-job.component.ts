import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../core/services/toast.service';
import { FormBuilder, Validators } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss']
})
export class AddJobComponent {

  // INPUTS
  @Input() modalType!: string;

  @Input() modalData: any;

  // OUTPUT
  @Output() saveJob = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private fb : FormBuilder,
    private jobService: JobService
  ) {}

  addJobForm = this.fb.group({
    job_Title:[
      '',
      Validators.required
    ],
    company_Name :[
      '',
      Validators.required
    ],
    location :[
      '',
      Validators.required
    ],
    job_Type:[
      '',
      Validators.required
    ],
    work_mode:[
      '',
      Validators.required
    ],
    status:[
      '',
      Validators.required
    ],
    applied_Date:[
      '',
      Validators.required
    ],
    job_Url: [''],

    notes: ['']

  })

  // submitJob() {

  //   if (this.addJobForm.invalid) {
  
  //     this.toastService.warning(
  //       'Please fill all required fields'
  //     );
  
  //     return;
  
  //   }
  
  //   const jobData = this.addJobForm.value;
  
  //   // Send data to parent component
  //   this.saveJob.emit(jobData);
  
  //   console.log('Job Submitted:', jobData);
  
  //   this.toastService.success(
  //     'Job added successfully'
  //   );
  
  //   // Close modal
  //   this.activeModal.close();
  
  // }
  submitJob() {

    if (this.addJobForm.invalid) {
  
      this.addJobForm.markAllAsTouched();
  
      this.toastService.warning(
        'Please fill all required fields'
      );
  
      return;
    }
  
    const payload = this.addJobForm.value;
  
    this.jobService.createJob(payload)
      .subscribe({
  
        next: (response) => {
  
          console.log(response);
  
          this.toastService.success(
            'Job added successfully'
          );
  
          this.saveJob.emit(response.data);
  
          this.activeModal.close();
  
        },
  
        error: (error) => {
  
          console.log(error);
  
          this.toastService.error(
            'Failed to create job'
          );
  
        }
  
      });
  
  }


  

}