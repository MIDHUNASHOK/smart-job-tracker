import { Component } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddJobComponent } from '../../jobs/add-job/add-job.component';
import { ConfirmModalComponent } from '../../../shared/modals/confirm-modal/confirm-modal.component';
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent {

  jobs: any[] = [];

  loading = false;

  constructor(
    private jobService: JobService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {

    this.getAllJobs();

  }

  getAllJobs() {
    debugger

    this.loading = true;

    this.jobService.getAllJobs()
      .subscribe({

        next: (response) => {

          console.log(response);

          this.jobs = response.data;

          this.loading = false;

        },

        error: (error) => {

          console.log(error);

          this.loading = false;

        }

      });

  }


  openEditModal(job: any) {
    const modalRef = this.modalService.open(
      AddJobComponent,
      {
        centered: true,
        size: 'lg'
      }
    );
  
    // modal type
    modalRef.componentInstance.modalType = 'edit';
  
    // selected row data
    modalRef.componentInstance.modalData = job;
  
    // refresh after update
    modalRef.componentInstance.saveJob.subscribe(() => {
  
      this.getAllJobs();
  
    });
  
  }

  openDeleteModal(job: any) {

    const modalRef = this.modalService.open(
      ConfirmModalComponent,
      {
        centered: true
      }
    );
  
    modalRef.componentInstance.title =
      'Delete Job';
  
    modalRef.componentInstance.message =
      `Are you sure you want to delete ${job.job_Title} Job Application ?`;
  
  
  
    modalRef.componentInstance.confirm
      .subscribe(() => {
  
        this.jobService.deleteJob(job.id)
          .subscribe({
  
            next: () => {
  
              this.getAllJobs();
  
            },
  
            error: (error) => {
  
              console.log(error);
  
            }
  
          });
  
      });
  
  }

}
