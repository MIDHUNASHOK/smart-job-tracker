import { Component } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profile: any;
constructor(private profileService : ProfileService )
{

}

  ngOnInit(): void {

    this.loadProfile();
  
  }


  loadProfile() {
debugger
    this.profileService
      .getProfile()
      .subscribe({
  
        next: (response:any) => {
  
          this.profile = response.data;
  
        }
  
      });
  
  }

}
