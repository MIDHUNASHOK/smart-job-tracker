import { Component } from '@angular/core';

import {
  FormBuilder,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss'
})
export class ForgotpasswordComponent {



  isLoading = false;

  forgotForm = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ]

  });

  constructor(
    private fb: FormBuilder
  ) {}

  onSubmit() {

    if (this.forgotForm.invalid) {
      return;
    }

    this.isLoading = true;

    setTimeout(() => {

      alert(
        'If this email exists, a reset link will be sent.'
      );

      this.isLoading = false;

    }, 1000);

  }

}