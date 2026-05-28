import { Component, EventEmitter, Input, Output } from '@angular/core';

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
}
