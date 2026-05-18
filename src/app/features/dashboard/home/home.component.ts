import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';
import { AddJobComponent } from '../../jobs/add-job/add-job.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private router:Router,
    private modalService: NgbModal,
  ){
  }

  statsCards = [

    {
      title: 'Total Applications',
      value: 128,
      growth: '12%',
      type: 'positive',
      icon: 'briefcase',
      color: 'blue'
    },
  
    {
      title: 'Interviews',
      value: 32,
      growth: '8%',
      type: 'positive',
      icon: 'people',
      color: 'purple'
    },
  
    {
      title: 'Offers',
      value: 6,
      growth: '20%',
      type: 'positive',
      icon: 'award',
      color: 'green'
    },
  
    {
      title: 'Rejections',
      value: 90,
      growth: '5%',
      type: 'negative',
      icon: 'x-circle',
      color: 'red'
    },
  
    {
      title: 'Pending',
      value: 60,
      growth: '8%',
      type: 'warning',
      icon: 'hourglass-split',
      color: 'yellow'
    }
  
  ];


   /* =========================
     CHART DATA
  ========================= */

  public lineChartData: ChartConfiguration<'line'>['data'] = {

    labels: [

      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul'

    ],

    datasets: [

      {

        label: 'Applications',

        data: [

          12,
          19,
          14,
          28,
          24,
          36,
          42

        ],

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
     CHART OPTIONS
  ========================= */

  public lineChartOptions: ChartOptions<'line'> = {

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

public pieChartOptions: ChartOptions<'doughnut'> = {

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

public pieChartData: ChartConfiguration<'doughnut'>['data'] = {

  labels: [

    'Applied',
    'Interviews',
    'Offers',
    'Rejected',
    'Pending'

  ],

  datasets: [

    {

      data: [

        128,
        32,
        6,
        90,
        60

      ],

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



openModal(type: string, data: any = null) {

  const modalRef = this.modalService.open(AddJobComponent, {
    centered: true,
    size: 'lg',
    backdrop: 'static'
  });

  // Passing data using Input
  modalRef.componentInstance.modalType = type;

  modalRef.componentInstance.modalData = data;

  // Receiving data using Output
  modalRef.componentInstance.saveJob.subscribe((jobData: any) => {

    console.log('Received Job Data:', jobData);

    // API call later here

  });

}

}
