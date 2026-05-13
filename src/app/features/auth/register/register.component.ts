import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  registerForm = this.fb.group({

    fullName: [
      '',
      Validators.required
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],

    confirmPassword: [
      '',
      Validators.required
    ]
  });

  onRegister(): void {

    if (this.registerForm.invalid) {
      return;
    }

    const password =
      this.registerForm.value.password;

    const confirmPassword =
      this.registerForm.value.confirmPassword;

    if (password !== confirmPassword) {

      alert('Passwords do not match');

      return;
    }

    this.isLoading = true;

    const userData = {

      fullName: this.registerForm.value.fullName,

      email: this.registerForm.value.email,

      password: this.registerForm.value.password
    };

    this.authService.register(userData)
      .subscribe({

        next: (response: any) => {

          console.log(response);

          alert('Registration Successful');

          this.router.navigate(['/login']);

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
