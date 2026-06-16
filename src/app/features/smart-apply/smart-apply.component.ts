import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-smart-apply',
  templateUrl: './smart-apply.component.html',
  styleUrl: './smart-apply.component.scss'
})
export class SmartApplyComponent {
   selectedResume: File | null = null;

  isSending = false;

  smartApplyForm = this.fb.group({

    companyName: [
      '',
      Validators.required
    ],

    recruiterEmail: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    jobTitle: [
      '',
      Validators.required
    ],

    location: [
      ''
    ],

    subject: [
      '',
      Validators.required
    ],

    coverEmail: [
      '',
      Validators.required
    ]

  });

  constructor(
    private fb: FormBuilder
  ) {}

  generateEmail() {

    const company =
      this.smartApplyForm.value.companyName || 'your company';

    const jobTitle =
      this.smartApplyForm.value.jobTitle || 'the position';

    const generatedEmail =
`Dear Hiring Team,

I hope you are doing well.

I am writing to express my interest in the ${jobTitle} position at ${company}. I have hands-on experience in Angular, TypeScript, Node.js, PostgreSQL, REST APIs, and building responsive web applications.

I believe my technical background and project experience make me a strong candidate for this role. I would be happy to discuss how my skills can contribute to your team.

Please find my resume attached for your review.

Thank you for your time and consideration.

Kind regards,
Midhun Ashok`;

    this.smartApplyForm.patchValue({
      subject: `Application for ${jobTitle} Position`,
      coverEmail: generatedEmail
    });

  }

  onResumeSelected(event: any) {

    const file =
      event.target.files[0];

    if (file) {
      this.selectedResume = file;
    }

  }

  sendApplication() {

    if (this.smartApplyForm.invalid) {

      this.smartApplyForm.markAllAsTouched();

      return;

    }

    if (!this.selectedResume) {

      alert('Please upload your resume');

      return;

    }

    console.log('Smart Apply Data:', this.smartApplyForm.value);
    console.log('Resume:', this.selectedResume);

    alert('Application preview ready. Backend sending will be added next.');

  }

}
