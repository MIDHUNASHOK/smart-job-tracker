import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  userName:string='';
  @Output()
  toggleSidebar =
    new EventEmitter<void>();
    userInitial='';

    constructor( 
      private authService: AuthService,
      private router: Router
      )
    {
      
    }


    // ngOnInit(): void {

    //   this.userName =
    //     localStorage.getItem('userName') || '';
    
    // }
    ngOnInit(): void {

      this.userName =
        localStorage.getItem('userName') || '';
    
      this.userInitial = this.userName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    
    }


    logout(){
      localStorage.clear();
      this.router.navigate(['/login']);
      
    }
}
