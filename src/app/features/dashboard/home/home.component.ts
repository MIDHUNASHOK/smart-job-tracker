
import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

import { AddJobComponent } from '../../jobs/add-job/add-job.component';

import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  statsCards: any[] = [];

  constructor(

    private router: Router,

    private modalService: NgbModal,

    private jobService: JobService

  ) {}



  ngOnInit(): void {

    this.getDashboardStats();

  }



  /* =========================
     GET DASHBOARD DATA
  ========================= */

  getDashboardStats() {

    this.jobService.getAllJobs()

      .subscribe({

        next: (response) => {

          const jobs = response.data;



          /* =========================
             TOTAL COUNTS
          ========================= */

          const totalApplications =

            jobs.length;



          const totalInterviews =

            jobs.filter(

              (job: any) =>

                job.status ===
                'Interview Scheduled'

            ).length;



          const totalOffers =

            jobs.filter(

              (job: any) =>

                job.status ===
                'Offer Received'

            ).length;



          const totalRejections =

            jobs.filter(

              (job: any) =>

                job.status ===
                'Rejected'

            ).length;



          const totalPending =

            jobs.filter(

              (job: any) =>

                job.status ===
                'Applied'

            ).length;



          /* =========================
             UPDATE STATS CARDS
          ========================= */

          this.statsCards = [

            {
              title: 'Total Applications',

              value: totalApplications,

              growth: '12%',

              type: 'positive',

              color: 'blue',

              icon: 'briefcase'
            },

            {
              title: 'Interviews',

              value: totalInterviews,

              growth: '8%',

              type: 'positive',

              color: 'purple',

              icon: 'people'
            },

            {
              title: 'Offers',

              value: totalOffers,

              growth: '20%',

              type: 'positive',

              color: 'green',

              icon: 'award'
            },

            {
              title: 'Rejections',

              value: totalRejections,

              growth: '5%',

              type: 'negative',

              color: 'red',

              icon: 'x-circle'
            },

            {
              title: 'Pending',

              value: totalPending,

              growth: '8%',

              type: 'warning',

              color: 'yellow',

              icon: 'hourglass'
            }

          ];



          /* =========================
             PIE CHART DYNAMIC DATA
          ========================= */

          this.pieChartData.datasets[0].data = [

            totalApplications,

            totalInterviews,

            totalOffers,

            totalRejections,

            totalPending

          ];



          /* =========================
             LINE CHART DYNAMIC DATA
          ========================= */

          const monthlyCounts: any = {

            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0

          };



          jobs.forEach((job: any) => {

            const date = new Date(
              job.applied_Date
            );

            const month =
              date.toLocaleString(
                'default',
                { month: 'short' }
              );

            monthlyCounts[month]++;

          });



          this.lineChartData.labels =

            Object.keys(monthlyCounts);



          this.lineChartData.datasets[0].data =

            Object.values(monthlyCounts);

        },



        error: (error) => {

          console.log(error);

        }

      });

  }



  /* =========================
     LINE CHART DATA
  ========================= */

  public lineChartData:
    ChartConfiguration<'line'>['data'] = {

    labels: [],

    datasets: [

      {

        label: 'Applications',

        data: [],

        borderColor: '#2563eb',

        backgroundColor:
          'rgba(37, 99, 235, 0.15)',

        fill: true,

        tension: 0.4,

        pointRadius: 5,

        pointHoverRadius: 7,

        pointBackgroundColor: '#2563eb',

        pointBorderColor: '#ffffff',

        pointHoverBackgroundColor: '#ffffff',

        pointHoverBorderColor: '#2563eb'

      }

    ]

  };



  /* =========================
     LINE CHART OPTIONS
  ========================= */

  public lineChartOptions:
    ChartOptions<'line'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        display: false

      }

    },

    scales: {

      x: {

        grid: {

          display: false

        },

        ticks: {

          color: '#64748b'

        }

      },

      y: {

        beginAtZero: true,

        grid: {

          color: '#f1f5f9'

        },

        ticks: {

          color: '#64748b'

        }

      }

    }

  };



  /* =========================
     PIE CHART OPTIONS
  ========================= */

  public pieChartOptions:
    ChartOptions<'doughnut'> = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: '72%',

    plugins: {

      legend: {

        display: false

      }

    }

  };



  /* =========================
     PIE CHART DATA
  ========================= */

  public pieChartData:
    ChartConfiguration<'doughnut'>['data'] = {

    labels: [

      'Applied',
      'Interviews',
      'Offers',
      'Rejected',
      'Pending'

    ],

    datasets: [

      {

        data: [],

        backgroundColor: [

          '#2563eb',
          '#7c3aed',
          '#16a34a',
          '#dc2626',
          '#f59e0b'

        ],

        borderWidth: 0,

        hoverOffset: 8

      }

    ]

  };



  /* =========================
     OPEN MODAL
  ========================= */

  openModal(type: string, data: any = null) {

    const modalRef =
      this.modalService.open(
        AddJobComponent,
        {
          centered: true,
          size: 'lg',
          backdrop: 'static'
        }
      );



    // INPUTS

    modalRef.componentInstance.modalType = type;

    modalRef.componentInstance.modalData = data;



    // OUTPUT

    modalRef.componentInstance.saveJob
      .subscribe((jobData: any) => {

        console.log(
          'Received Job Data:',
          jobData
        );



        // REFRESH DASHBOARD

        this.getDashboardStats();

      });

  }

}
