import { Component } from '@angular/core';
import { InactivityService } from '../../core/services/inactivity.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {


  sidebarCollapsed = false;

  mobileSidebarOpen = false;
   constructor(
    private inactivityService: InactivityService
  ) {}

  ngOnInit(): void {
    // The layout only exists while the user is inside the authenticated area,
    // so this is the natural place to start watching for inactivity.
    this.inactivityService.start();
  }
 
  ngOnDestroy(): void {
    // Leaving the authenticated area (e.g. after logout) tears the timer down.
    this.inactivityService.stop();
  }

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
