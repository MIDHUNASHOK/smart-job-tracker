

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';

const routes: Routes = [

  // Default Route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Auth Routes
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then(
        m => m.AuthModule
      )
  },

  // Main Layout Routes
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], 
    children: [

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            m => m.DashboardModule
          )
      },

      {
        path: 'jobs',
        loadChildren: () =>
          import('./features/jobs/jobs.module').then(
            m => m.JobsModule
          )
      },

      {
        path: 'analytics',
        loadChildren: () =>
          import('./features/analytics/analytics.module').then(
            m => m.AnalyticsModule
          )
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.module').then(
            m => m.ProfileModule
          )
      },
      {
        path: 'smart_apply',
        loadChildren: () =>
          import('./features/smart-apply/smart-apply.module').then(
            m => m.SmartApplyModule
          )
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }