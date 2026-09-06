import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

type WorkflowStep = 1 | 2 | 3 | 4;
type ApplicationMethod = 'LINKEDIN' | 'INDEED' | 'EMAIL' | 'COMPANY_WEBSITE';
type DocumentTab = 'cv' | 'coverLetter' | 'email';
type ApplicationStatus = 'SAVED' | 'ANALYZED' | 'PREPARED' | 'APPROVED' | 'APPLIED';

interface ScoreBreakdown {
  overall: number;
  skills: number;
  experience: number;
  location: number;
  workPreference: number;
}

interface SmartApplyAnalysis {
  scores: ScoreBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  strongExperienceEvidence: string[];
  cvImprovements: string[];
  recommendedSummary: string;
  interviewSuggestions: string[];
}

@Component({
  selector: 'app-smart-apply',
  templateUrl: './smart-apply.component.html',
  styleUrl: './smart-apply.component.scss'
})
export class SmartApplyComponent implements OnDestroy {
  currentStep: WorkflowStep = 1;
  applicationStatus: ApplicationStatus = 'SAVED';
  activeDocumentTab: DocumentTab = 'cv';

  selectedResume: File | null = null;
  isAnalyzing = false;
  isPreparing = false;
  isApproving = false;
  analysis: SmartApplyAnalysis | null = null;

  readonly allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  readonly maxSizeMb = 5;

  readonly workflowSteps = [
    { number: 1, label: 'Select job' },
    { number: 2, label: 'Analyze match' },
    { number: 3, label: 'Prepare application' },
    { number: 4, label: 'Review & apply' }
  ];

  readonly applicationMethods: Array<{
    value: ApplicationMethod;
    label: string;
    description: string;
    icon: string;
  }> = [
    { value: 'LINKEDIN', label: 'LinkedIn', description: 'Open the original LinkedIn application', icon: 'bi-linkedin' },
    { value: 'INDEED', label: 'Indeed', description: 'Open the original Indeed application', icon: 'bi-briefcase' },
    { value: 'EMAIL', label: 'Email', description: 'Prepare an email for the recruiter', icon: 'bi-envelope' },
    { value: 'COMPANY_WEBSITE', label: 'Company website', description: 'Open the employer career page', icon: 'bi-building' }
  ];

  readonly statusFlow: ApplicationStatus[] = [
    'SAVED', 'ANALYZED', 'PREPARED', 'APPROVED', 'APPLIED'
  ];

  smartApplyForm: FormGroup = this.fb.group({
    source: ['LINKEDIN', Validators.required],
    savedJobId: [''],
    jobUrl: ['', [Validators.required, this.urlValidator]],
    companyName: ['', Validators.required],
    jobTitle: ['', Validators.required],
    location: [''],
    workPreference: ['HYBRID'],
    jobDescription: ['', [Validators.required, Validators.minLength(80)]],
    applicationMethod: ['LINKEDIN', Validators.required],
    recruiterEmail: ['', Validators.email],
    subject: [''],
    tailoredSummary: [''],
    tailoredCv: [''],
    coverLetter: [''],
    applicationEmail: ['']
  });

  private readonly subscriptions = new Subscription();

  constructor(private fb: FormBuilder) {
    this.updateApplicationValidators('LINKEDIN');
    this.subscriptions.add(
      this.f['applicationMethod'].valueChanges.subscribe((method: ApplicationMethod) => {
        this.updateApplicationValidators(method);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get f(): Record<string, AbstractControl> {
    return this.smartApplyForm.controls;
  }

  get selectedMethod(): ApplicationMethod {
    return this.f['applicationMethod'].value as ApplicationMethod;
  }

  get actionLabel(): string {
    return this.selectedMethod === 'EMAIL'
      ? 'Approve & prepare email'
      : 'Approve & open application';
  }

  get completedStatusIndex(): number {
    return this.statusFlow.indexOf(this.applicationStatus);
  }

  selectSource(source: 'SAVED' | 'LINKEDIN' | 'INDEED'): void {
    this.f['source'].setValue(source);

    if (source === 'LINKEDIN' || source === 'INDEED') {
      this.f['applicationMethod'].setValue(source);
    }
  }

  loadDemoJob(): void {
    this.smartApplyForm.patchValue({
      source: 'LINKEDIN',
      jobUrl: 'https://www.linkedin.com/jobs/view/example',
      companyName: 'TechNova GmbH',
      jobTitle: 'Senior Angular Developer',
      location: 'Berlin, Germany',
      workPreference: 'HYBRID',
      applicationMethod: 'LINKEDIN',
      jobDescription: `We are looking for a Senior Angular Developer with strong Angular,
TypeScript, RxJS, Node.js and PostgreSQL experience. The candidate should have
experience designing REST APIs, building scalable web applications, using Git,
CI/CD and Docker. This is a full-time hybrid role based in Berlin.`
    });
  }

  analyzeJob(): void {
    const requiredFields = ['jobUrl', 'companyName', 'jobTitle', 'jobDescription'];
    requiredFields.forEach(field => this.f[field].markAsTouched());

    if (requiredFields.some(field => this.f[field].invalid)) {
      return;
    }

    this.isAnalyzing = true;

    // Replace this timeout and mock result with POST /api/smart-apply/analyze.
    setTimeout(() => {
      this.analysis = {
        scores: { overall: 87, skills: 90, experience: 85, location: 100, workPreference: 75 },
        matchedSkills: ['Angular', 'TypeScript', 'RxJS', 'Node.js', 'PostgreSQL'],
        missingSkills: ['Docker', 'Kubernetes'],
        missingKeywords: ['CI/CD', 'REST APIs', 'Scalability'],
        strongExperienceEvidence: [
          'Built Angular applications integrated with Node.js and PostgreSQL.',
          'Led development of a production web application and worked with REST APIs.'
        ],
        cvImprovements: [
          'Highlight projects where you designed or consumed REST APIs.',
          'Add measurable performance, delivery or scalability results.',
          'Mention CI/CD or Docker only if you have genuine practical experience.'
        ],
        recommendedSummary: 'Angular-focused full-stack developer with experience building responsive applications using TypeScript, RxJS, Node.js, REST APIs and PostgreSQL. Experienced in leading application development and delivering maintainable, user-centred software.',
        interviewSuggestions: [
          'Explain Angular change detection and component lifecycle hooks.',
          'Prepare an example of solving an RxJS data-flow problem.',
          'Describe how you design and secure a REST API.',
          'Review PostgreSQL indexing and query optimisation.',
          'Prepare a truthful answer about your current Docker experience.'
        ]
      };

      this.f['tailoredSummary'].setValue(this.analysis.recommendedSummary);
      this.isAnalyzing = false;
      this.currentStep = 2;
      this.applicationStatus = 'ANALYZED';
    }, 800);
  }

  prepareApplication(): void {
    if (!this.analysis) {
      return;
    }

    this.isPreparing = true;
    const company = this.f['companyName'].value;
    const role = this.f['jobTitle'].value;
    const summary = this.f['tailoredSummary'].value;

    setTimeout(() => {
      this.smartApplyForm.patchValue({
        subject: `Application for ${role}`,
        tailoredCv: `${summary}\n\nCORE SKILLS\nAngular, TypeScript, RxJS, Node.js, PostgreSQL, REST APIs\n\nRELEVANT EXPERIENCE\nBuilt and maintained Angular applications integrated with Node.js and PostgreSQL. Led application development and collaborated with cross-functional teams.`,
        coverLetter: `Dear Hiring Team,\n\nI am excited to apply for the ${role} position at ${company}. My experience building Angular applications with TypeScript, RxJS, Node.js and PostgreSQL aligns strongly with the role.\n\nIn my previous work, I contributed to production applications, REST API integration and maintainable frontend architecture. I would welcome the opportunity to bring this experience to your team.\n\nKind regards,\nMidhun Ashok`,
        applicationEmail: `Dear Hiring Team,\n\nPlease find attached my application for the ${role} position at ${company}. My background in Angular, TypeScript, Node.js and PostgreSQL aligns well with the requirements.\n\nI would be pleased to discuss my experience further.\n\nKind regards,\nMidhun Ashok`
      });

      this.isPreparing = false;
      this.currentStep = 3;
      this.applicationStatus = 'PREPARED';
    }, 700);
  }

  setDocumentTab(tab: DocumentTab): void {
    this.activeDocumentTab = tab;
  }

  regenerateDocument(): void {
    this.prepareApplication();
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

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

  removeResume(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.selectedResume = null;
  }

  approveApplication(): void {
    if (!this.analysis || this.applicationStatus !== 'PREPARED') return;

    const fields = this.selectedMethod === 'EMAIL'
      ? ['recruiterEmail', 'subject', 'applicationEmail']
      : ['jobUrl'];

    fields.forEach(field => this.f[field].markAsTouched());
    if (fields.some(field => this.f[field].invalid)) return;

    this.isApproving = true;

    setTimeout(() => {
      this.isApproving = false;
      this.currentStep = 4;
      this.applicationStatus = 'APPROVED';

      if (this.selectedMethod === 'EMAIL') {
        alert('Application approved. Connect the backend email endpoint to send it.');
        return;
      }

      const url = this.f['jobUrl'].value;
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 500);
  }

  confirmSubmitted(): void {
    if (this.applicationStatus !== 'APPROVED') return;
    this.applicationStatus = 'APPLIED';
    alert('Application marked as submitted.');
  }

  saveForLater(): void {
    alert(`Application saved with status: ${this.applicationStatus}`);
  }

  resetWorkflow(): void {
    this.smartApplyForm.reset({
      source: 'LINKEDIN',
      workPreference: 'HYBRID',
      applicationMethod: 'LINKEDIN'
    });
    this.selectedResume = null;
    this.analysis = null;
    this.currentStep = 1;
    this.applicationStatus = 'SAVED';
    this.activeDocumentTab = 'cv';
  }

  private updateApplicationValidators(method: ApplicationMethod): void {
    const email = this.f['recruiterEmail'];
    const url = this.f['jobUrl'];

    if (method === 'EMAIL') {
      email.setValidators([Validators.required, Validators.email]);
      url.clearValidators();
    } else {
      email.setValidators([Validators.email]);
      url.setValidators([Validators.required, this.urlValidator]);
    }

    email.updateValueAndValidity({ emitEvent: false });
    url.updateValueAndValidity({ emitEvent: false });
  }

  private urlValidator(control: AbstractControl): { invalidUrl: true } | null {
    if (!control.value) return null;

    try {
      const url = new URL(control.value);
      return url.protocol === 'http:' || url.protocol === 'https:' ? null : { invalidUrl: true };
    } catch {
      return { invalidUrl: true };
    }
  }
}