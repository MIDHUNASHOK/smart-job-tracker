import { Component } from '@angular/core';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent {

  jobs: any[] = [];

  loading = false;

  constructor(
    private jobService: JobService
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


}
