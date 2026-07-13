import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';

@Component({
  selector: 'app-smart-apply',
  templateUrl: './smart-apply.component.html',
  styleUrl: './smart-apply.component.scss'
})
export class SmartApplyComponent {

  selectedResume: File | null = null;
  isSending = false;

  readonly allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  readonly maxSizeMb = 5;

  smartApplyForm: FormGroup = this.fb.group({
    companyName: ['', Validators.required],
    recruiterEmail: ['', [Validators.required, Validators.email]],
    jobTitle: ['', Validators.required],
    location: [''],
    subject: ['', Validators.required],
    coverEmail: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  get f() {
    return this.smartApplyForm.controls;
  }

  generateEmail(): void {
    const company = this.f['companyName'].value?.trim() || 'your company';
    const jobTitle = this.f['jobTitle'].value?.trim() || 'the position';
    const location = this.f['location'].value?.trim();

    const locationLine = location
      ? `I am currently based in ${location} and available to join at short notice.\n\n`
      : '';

    const generatedEmail =
`Dear Hiring Team,

I hope you are doing well.

I am writing to express my interest in the ${jobTitle} position at ${company}. I have hands-on experience in Angular, TypeScript, Node.js, PostgreSQL, REST APIs, and building responsive web applications.

${locationLine}I believe my technical background and project experience make me a strong candidate for this role. I would be happy to discuss how my skills can contribute to your team.

Please find my resume attached for your review.

Thank you for your time and consideration.

Kind regards,
Midhun Ashok`;

    this.smartApplyForm.patchValue({
      subject: `Application for ${jobTitle} Position`,
      coverEmail: generatedEmail
    });

    this.smartApplyForm.markAsDirty();
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.allowedTypes.includes(file.type)) {
      alert('Only PDF, DOC or DOCX files are allowed.');
      input.value = '';
      this.selectedResume = null;
      return;
    }

    if (file.size > this.maxSizeMb * 1024 * 1024) {
      alert(`File must be smaller than ${this.maxSizeMb} MB.`);
      input.value = '';
      this.selectedResume = null;
      return;
    }

    this.selectedResume = file;
  }

  removeResume(): void {
    this.selectedResume = null;
  }

  sendApplication(): void {
    if (this.smartApplyForm.invalid) {
      this.smartApplyForm.markAllAsTouched();
      return;
    }

    if (!this.selectedResume) {
      alert('Please upload your resume');
      return;
    }

    this.isSending = true;

    const formData = new FormData();
    const value = this.smartApplyForm.value;

    formData.append('companyName', value.companyName);
    formData.append('recruiterEmail', value.recruiterEmail);
    formData.append('jobTitle', value.jobTitle);
    formData.append('location', value.location ?? '');
    formData.append('subject', value.subject);
    formData.append('coverEmail', value.coverEmail);
    formData.append('resume', this.selectedResume, this.selectedResume.name);

    // Replace with a real HttpClient call when the backend is ready:
    // this.http.post('/api/applications/send', formData).subscribe({
    //   next: () => this.onSendSuccess(),
    //   error: () => this.onSendError()
    // });

    setTimeout(() => this.onSendSuccess(), 1200);
  }

  private onSendSuccess(): void {
    this.isSending = false;
    alert('Application prepared successfully.');
    this.resetForm();
  }

  private onSendError(): void {
    this.isSending = false;
    alert('Something went wrong while sending. Please try again.');
  }

  private resetForm(): void {
    this.smartApplyForm.reset();
    this.selectedResume = null;
  }
}