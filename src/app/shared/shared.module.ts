import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MainLayoutComponent } from './main-layout/main-layout.component';

// import { NavbarComponent } from './navbar/navbar.component';
// import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';



@NgModule({
  declarations: [
    MainLayoutComponent,
    SidebarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ], exports: [
    MainLayoutComponent,
    SidebarComponent,
    NavbarComponent
  ]
})
export class SharedModule { }
