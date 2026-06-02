import { Component } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddJobComponent } from '../../jobs/add-job/add-job.component';
import { ConfirmModalComponent } from '../../../shared/modals/confirm-modal/confirm-modal.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent {

  jobs: any[] = [];
  searchText = '';
  selectedStatus = '';
  filteredJobs: any[] = [];

  currentPage = 1;

  itemsPerPage = 5;

  paginatedJobs: any[] = [];

  totalPages = 0;

  loading = false;

  constructor(
    private jobService: JobService,
    private modalService: NgbModal,
  ) { }

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
          this.filteredJobs = [...this.jobs];
          this.updatePagination();

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

  filterByStatus() {

    // if (!this.selectedStatus) {

    //   this.filteredJobs = [
    //     ...this.jobs
    //   ];

    //   return;

    // }

    if (this.selectedStatus === '') {

      this.filteredJobs = [...this.jobs];

      this.currentPage = 1;

      this.updatePagination();

      return;

    }

    this.filteredJobs =

      this.jobs.filter(

        (job: any) =>

          job.status ===
          this.selectedStatus

      );
    this.currentPage = 1;

    this.updatePagination();

  }


  updatePagination() {

    this.totalPages = Math.ceil(
      this.filteredJobs.length /
      this.itemsPerPage
    );

    const startIndex =

      (this.currentPage - 1) *
      this.itemsPerPage;

    const endIndex =

      startIndex +
      this.itemsPerPage;

    this.paginatedJobs =

      this.filteredJobs.slice(
        startIndex,
        endIndex
      );

  }



  applyFilters() {

    this.filteredJobs = this.jobs.filter(
      (job: any) => {

        const searchMatch =

          !this.searchText ||

          job.company_Name
            ?.toLowerCase()
            .includes(
              this.searchText.toLowerCase()
            ) ||

          job.job_Title
            ?.toLowerCase()
            .includes(
              this.searchText.toLowerCase()
            );

        const statusMatch =

          !this.selectedStatus ||

          job.status ===
          this.selectedStatus;

        return (
          searchMatch &&
          statusMatch
        );

      }
    );

    this.currentPage = 1;

    this.updatePagination();

  }


  onSearch() {

    this.currentPage = 1;

    this.updatePagination();

  }

  get pages(): number[] {

    return Array.from(

      { length: this.totalPages },

      (_, i) => i + 1

    );

  }


  previousPage() {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }

  nextPage() {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.updatePagination();

    }

  }


  changePage(page: number) {

    this.currentPage = page;

    this.updatePagination();

  }



  downloadPdf() {

    const doc = new jsPDF();
  
    const userName =
      localStorage.getItem('userName') || 'User';
  
    // Title
  
    doc.setFontSize(18);
  
    doc.text(
      'Job Applications Report',
      14,
      20
    );
  
    // User Info
  
    doc.setFontSize(12);
  
    doc.text(
      `Candidate: ${userName}`,
      14,
      30
    );
  
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      14,
      38
    );
  
    // Table Data
  
    const rows = this.filteredJobs.map(
      (job: any) => [
  
        job.company_Name,
  
        job.job_Title,
  
        job.status,
  
        new Date(
          job.applied_Date
        ).toLocaleDateString()
  
      ]
    );
  
    // Table
  
    autoTable(doc, {
  
      startY: 50,
  
      head: [[
        'Company',
        'Role',
        'Status',
        'Applied Date'
      ]],
  
      body: rows
  
    });
  
    // Footer
  
    const pageHeight =
      doc.internal.pageSize.height;
  
    doc.setFontSize(10);
  
    doc.text(
      'Generated by JobPilot',
      14,
      pageHeight - 10
    );
  
    // Save
  
    doc.save(
      `JobPilot_Applications_${new Date().getTime()}.pdf`
    );
  
  }

}
