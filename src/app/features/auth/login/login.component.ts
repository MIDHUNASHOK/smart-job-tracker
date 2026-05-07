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

// import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

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

        this.authService.saveToken(
          response.token
        );

        alert('Login Successful');

        this.router.navigate(['/dashboard']);

        this.isLoading = false;
      },

      error: (error) => {

        console.log(error);

        alert(error.error.message);

        this.isLoading = false;
      }
    });
  }
}