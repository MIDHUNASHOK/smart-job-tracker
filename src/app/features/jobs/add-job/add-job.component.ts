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

  ngOnInit(): void {

    // EDIT MODE
    if (
      this.modalType === 'edit' &&
      this.modalData
    ) {
  
      this.addJobForm.patchValue({
  
        job_Title: this.modalData.job_Title,
  
        company_Name: this.modalData.company_Name,
  
        location: this.modalData.location,
  
        job_Type: this.modalData.job_Type,
  
        work_mode: this.modalData.work_mode,
  
        status: this.modalData.status,
  
        applied_Date:
          this.modalData.applied_Date
            ?.split('T')[0],
  
        job_Url: this.modalData.job_Url,
  
        notes: this.modalData.notes
  
      });
  
    }
  
  }

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
  
  //     this.addJobForm.markAllAsTouched();
  
  //     this.toastService.warning(
  //       'Please fill all required fields'
  //     );
  
  //     return;
  //   }
  
  //   const payload = this.addJobForm.value;
  
  //   this.jobService.createJob(payload)
  //     .subscribe({
  
  //       next: (response) => {
  
  //         console.log(response);
  
  //         this.toastService.success(
  //           'Job added successfully'
  //         );
  
  //         this.saveJob.emit(response.data);
  
  //         this.activeModal.close();
  
  //       },
  
  //       error: (error) => {
  
  //         console.log(error);
  
  //         this.toastService.error(
  //           'Failed to create job'
  //         );
  
  //       }
  
  //     });
  
  // }


  submitJob() {

    if (this.addJobForm.invalid) {
  
      this.toastService.warning(
        'Please fill all required fields'
      );
  
      return;
  
    }
  
    // const payload = this.addJobForm.value;
    const payload = {

      ...this.addJobForm.value,
  
      applied_Date: new Date(
        this.addJobForm.value.applied_Date!
      ).toISOString()
  
    };
  
    // EDIT
    if (this.modalType === 'edit') {
      debugger
      this.jobService.updateJob(
        this.modalData.id,
        payload
      ).subscribe({
  
        next: (response) => {
  
          this.toastService.success(
            'Job updated successfully'
          );
  
          this.saveJob.emit(response);
  
          this.activeModal.close();
  
        },
  
        error: (error) => {
  
          console.log(error);
  
          this.toastService.error(
            'Failed to update job'
          );
  
        }
  
      });
  
    }
  
    // CREATE
    else {
  
      this.jobService.createJob(payload)
        .subscribe({
  
          next: (response) => {
  
            this.toastService.success(
              'Job added successfully'
            );
  
            this.saveJob.emit(response);
  
            this.activeModal.close();
  
          },
  
          error: (error) => {
  
            console.log(error);
  
            this.toastService.error(
              'Failed to add job'
            );
  
          }
  
        });
  
    }
  
  }

  

}