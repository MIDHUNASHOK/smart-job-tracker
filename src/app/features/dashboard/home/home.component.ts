import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BaseChartDirective } from 'ng2-charts';

import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

import { ChromeExtensionPopupComponent } from '../../../shared/modals/chrome-extension-popup/chrome-extension-popup.component';
import { AddJobComponent } from '../../jobs/add-job/add-job.component';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  chromeStoreUrl =
    'https://chromewebstore.google.com/detail/jgegomlhmdddpphokmaekelefgjblmhn';

  /* =========================
     CHART REFERENCES
     `read: BaseChartDirective` is required — without it the
     template ref resolves to the <canvas> element, which has
     no update() method.
  ========================= */

  @ViewChild('pieChart', { read: BaseChartDirective })
  doughnutChart?: BaseChartDirective;

  @ViewChild('lineChart', { read: BaseChartDirective })
  lineChart?: BaseChartDirective;

  recentJobs: any[] = [];
  allJobs: any[] = [];
  statsCards: any[] = [];

  totalApplications = 0;
  totalInterviews = 0;
  totalOffers = 0;
  totalRejections = 0;
  totalPending = 0;

  appliedCount = 0;
  interviewCount = 0;
  offerCount = 0;
  rejectedCount = 0;
  pendingCount = 0;

  selectedRange = '30days';
  selectedLineRange = '30days';
  selectedDoughnutRange = '30days';

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private jobService: JobService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const popupShown =
      localStorage.getItem('chromeExtensionPopupShown');

    if (!popupShown) {
      this.openChromePopup();
    }

    this.getDashboardStats();
  }

  installExtension(): void {
    window.open(
      this.chromeStoreUrl,
      '_blank',
      'noopener,noreferrer'
    );
  }

  onRangeChange(chartType: string): void {

    if (chartType === 'line') {
      this.updateDashboardData('line');
    } else {
      this.updateDashboardData('doughnut');
    }
  }

  /* =========================
     DASHBOARD DATA
  ========================= */

  getDashboardStats(): void {

    this.jobService.getAllJobs().subscribe({

      next: (response) => {

        const jobs = response.data;

        this.allJobs = jobs;

        this.recentJobs = [...jobs]
          .sort(
            (a, b) =>
              new Date(b.applied_Date).getTime() -
              new Date(a.applied_Date).getTime()
          )
          .slice(0, 5);

        this.totalApplications = jobs.length;

        this.totalInterviews = jobs.filter(
          (job: any) => job.status === 'Interview Scheduled'
        ).length;

        this.totalOffers = jobs.filter(
          (job: any) => job.status === 'Offer Received'
        ).length;

        this.totalRejections = jobs.filter(
          (job: any) => job.status === 'Rejected'
        ).length;

        this.totalPending = jobs.filter(
          (job: any) => job.status === 'Applied'
        ).length;

        const applicationGrowth = this.getGrowthByStatus(jobs);
        const interviewGrowth = this.getGrowthByStatus(jobs, 'Interview Scheduled');
        const offerGrowth = this.getGrowthByStatus(jobs, 'Offer Received');
        const rejectionGrowth = this.getGrowthByStatus(jobs, 'Rejected');
        const pendingGrowth = this.getGrowthByStatus(jobs, 'Applied');

        this.statsCards = [
          {
            title: 'Total Applications',
            value: this.totalApplications,
            growth: applicationGrowth,
            type: applicationGrowth >= 0 ? 'positive' : 'negative',
            color: 'blue',
            icon: 'briefcase'
          },
          {
            title: 'Interviews',
            value: this.totalInterviews,
            growth: interviewGrowth,
            type: interviewGrowth >= 0 ? 'positive' : 'negative',
            color: 'purple',
            icon: 'people'
          },
          {
            title: 'Offers',
            value: this.totalOffers,
            growth: offerGrowth,
            type: offerGrowth >= 0 ? 'positive' : 'negative',
            color: 'green',
            icon: 'award'
          },
          {
            title: 'Rejections',
            value: this.totalRejections,
            growth: rejectionGrowth,
            type: rejectionGrowth >= 0 ? 'positive' : 'negative',
            color: 'red',
            icon: 'x-circle'
          },
          {
            title: 'Pending',
            value: this.totalPending,
            growth: pendingGrowth,
            type: pendingGrowth >= 0 ? 'positive' : 'negative',
            color: 'yellow',
            icon: 'hourglass'
          }
        ];

        this.updateDashboardData('line');
        this.updateDashboardData('doughnut');

        this.cdr.detectChanges();
      }

    });
  }

  updateDashboardData(chartType: string): void {

    const currentDate = new Date();

    let filteredJobs = [...this.allJobs];

    const selectedRange =
      chartType === 'line'
        ? this.selectedLineRange
        : this.selectedDoughnutRange;

    if (selectedRange === '30days') {

      const last30Days = new Date();
      last30Days.setDate(currentDate.getDate() - 30);

      filteredJobs = this.allJobs.filter(
        (job: any) => new Date(job.applied_Date) >= last30Days
      );

    } else if (selectedRange === '6months') {

      const last6Months = new Date();
      last6Months.setMonth(currentDate.getMonth() - 6);

      filteredJobs = this.allJobs.filter(
        (job: any) => new Date(job.applied_Date) >= last6Months
      );

    } else if (selectedRange === '1year') {

      const lastYear = new Date();
      lastYear.setFullYear(currentDate.getFullYear() - 1);

      filteredJobs = this.allJobs.filter(
        (job: any) => new Date(job.applied_Date) >= lastYear
      );
    }

    if (chartType === 'line') {
      this.updateLineChart(filteredJobs);
    } else {
      this.updatePieChart(filteredJobs);
    }
  }

  updateLineChart(jobs: any[]): void {

    const monthlyCounts: any = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0,
      May: 0, Jun: 0, Jul: 0, Aug: 0,
      Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    jobs.forEach((job: any) => {

      const date = new Date(job.applied_Date);

      const month = date.toLocaleString('default', { month: 'short' });

      if (month in monthlyCounts) {
        monthlyCounts[month]++;
      }
    });

    this.lineChartData = {
      labels: Object.keys(monthlyCounts),
      datasets: [
        {
          label: 'Applications',
          data: Object.values(monthlyCounts) as number[],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#ffffff'
        }
      ]
    };

    setTimeout(() => this.lineChart?.update());
  }

  updatePieChart(jobs: any[]): void {

    this.appliedCount = jobs.filter(
      (job: any) => job.status === 'Applied'
    ).length;

    this.interviewCount = jobs.filter(
      (job: any) => job.status === 'Interview Scheduled'
    ).length;

    this.offerCount = jobs.filter(
      (job: any) => job.status === 'Offer Received'
    ).length;

    this.rejectedCount = jobs.filter(
      (job: any) => job.status === 'Rejected'
    ).length;

    this.pendingCount = jobs.filter(
      (job: any) => job.status === 'Saved'
    ).length;

    this.pieChartData = {
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
            this.appliedCount,
            this.interviewCount,
            this.offerCount,
            this.rejectedCount,
            this.pendingCount
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

    setTimeout(() => this.doughnutChart?.update());
  }

  /* =========================
     CHART CONFIG
  ========================= */

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Applications',
        data: [],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
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

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { color: '#64748b' }
      }
    }
  };

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

  public pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false }
    }
  };

  /* =========================
     HELPERS
  ========================= */

  getGrowthByStatus(jobs: any[], status?: string): number {

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentCount = jobs.filter((job: any) => {

      const date = new Date(job.applied_Date);
      const statusMatch = !status || job.status === status;

      return (
        statusMatch &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    }).length;

    const previousCount = jobs.filter((job: any) => {

      const date = new Date(job.applied_Date);
      const statusMatch = !status || job.status === status;

      return (
        statusMatch &&
        date.getMonth() === previousMonth &&
        date.getFullYear() === previousYear
      );
    }).length;

    return this.calculateGrowth(currentCount, previousCount);
  }

  calculateGrowth(current: number, previous: number): number {

    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Math.round(((current - previous) / previous) * 100);
  }

  getPercentage(value: number): number {

    const total =
      this.appliedCount +
      this.interviewCount +
      this.offerCount +
      this.rejectedCount +
      this.pendingCount;

    if (!total) {
      return 0;
    }

    return Math.round((value / total) * 100);
  }

  /* =========================
     MODALS / NAVIGATION
  ========================= */

  openModal(type: string, data: any = null): void {

    const modalRef = this.modalService.open(AddJobComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.modalType = type;
    modalRef.componentInstance.modalData = data;

    modalRef.componentInstance.saveJob.subscribe(() => {
      this.getDashboardStats();
    });
  }

  openChromePopup(): void {

    const alreadyShown =
      localStorage.getItem('chromeExtensionPopupShown');

    if (alreadyShown) {
      return;
    }

    const modalRef = this.modalService.open(
      ChromeExtensionPopupComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: 'static'
      }
    );

    modalRef.result.finally(() => {
      localStorage.setItem('chromeExtensionPopupShown', 'true');
    });
  }


    goToJobs() {

    this.router.navigate(
      ['/jobs/jobslist']
    );

  }
}

