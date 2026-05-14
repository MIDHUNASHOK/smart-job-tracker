import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  sidebarCollapsed = false;

  mobileSidebarOpen = false;

  toggleSidebar(): void {

    if (window.innerWidth <= 768) {

      this.mobileSidebarOpen =
        !this.mobileSidebarOpen;

    } else {

      this.sidebarCollapsed =
        !this.sidebarCollapsed;

    }

  }

  closeMobileSidebar(): void {

    this.mobileSidebarOpen = false;

  }

}
