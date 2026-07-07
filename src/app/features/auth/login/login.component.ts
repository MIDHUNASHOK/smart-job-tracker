// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss'
// })
// export class LoginComponent {

// }



import { Component } from '@angular/core';

import {
  FormBuilder,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

// import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  isLoading = false;

  showPassword = false;

 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  
togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

  loginForm = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      Validators.required
    ]
  });

  onLogin(): void {

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.login(
      this.loginForm.value
    )
    .subscribe({

      next: (response: any) => {
        console.log(response);
        localStorage.setItem(
          'userName',
          response.user.fullName
        );

        this.authService.saveToken(
          response.token
        );

       
        this.toastService.success('Job added successfully');

        this.router.navigate(['/dashboard']);

        this.isLoading = false;
      },

      error: (error) => {

        console.log(error);
        this.toastService.error(error.error.message);

        this.isLoading = false;
      }
    });
  }
}