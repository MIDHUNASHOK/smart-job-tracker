import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MainLayoutComponent } from './main-layout/main-layout.component';

// import { NavbarComponent } from './navbar/navbar.component';
// import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { SearchPipe } from './pipes/search.pipe';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [
    MainLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    ConfirmModalComponent,
    SearchPipe,
    UnderConstructionComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ], exports: [
    MainLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    ConfirmModalComponent,
    SearchPipe,
    UnderConstructionComponent
  ]
})
export class SharedModule { }
