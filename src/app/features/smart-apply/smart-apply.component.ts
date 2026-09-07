import {
  Component,
  OnDestroy
} from '@angular/core';
import { jsPDF } from 'jspdf';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  finalize,
  Subscription
} from 'rxjs';

import {
  AnalyzeJobRequest,
  GenerateApplicationRequest,
  SmartApplyAnalysis,
  SmartApplyService
} from '../../core/services/smart-apply.service';

type WorkflowStep = 1 | 2 | 3 | 4;

type ApplicationMethod =
  | 'LINKEDIN'
  | 'INDEED'
  | 'EMAIL'
  | 'COMPANY_WEBSITE';

type DocumentTab =
  | 'cv'
  | 'coverLetter'
  | 'email';

type ApplicationStatus =
  | 'SAVED'
  | 'ANALYZED'
  | 'PREPARED'
  | 'APPROVED'
  | 'APPLIED';

@Component({
  selector: 'app-smart-apply',
  templateUrl: './smart-apply.component.html',
  styleUrl: './smart-apply.component.scss'
})
export class SmartApplyComponent
  implements OnDestroy {

  currentStep: WorkflowStep = 1;

  applicationStatus: ApplicationStatus =
    'SAVED';

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
    {
      number: 1,
      label: 'Select job'
    },
    {
      number: 2,
      label: 'Analyze match'
    },
    {
      number: 3,
      label: 'Prepare application'
    },
    {
      number: 4,
      label: 'Review & apply'
    }
  ];

  readonly applicationMethods: Array<{
    value: ApplicationMethod;
    label: string;
    description: string;
    icon: string;
  }> = [
    {
      value: 'LINKEDIN',
      label: 'LinkedIn',
      description:
        'Open the original LinkedIn application',
      icon: 'bi-linkedin'
    },
    {
      value: 'INDEED',
      label: 'Indeed',
      description:
        'Open the original Indeed application',
      icon: 'bi-briefcase'
    },
    {
      value: 'EMAIL',
      label: 'Email',
      description:
        'Prepare an email for the recruiter',
      icon: 'bi-envelope'
    },
    {
      value: 'COMPANY_WEBSITE',
      label: 'Company website',
      description:
        'Open the employer career page',
      icon: 'bi-building'
    }
  ];

  readonly statusFlow: ApplicationStatus[] = [
    'SAVED',
    'ANALYZED',
    'PREPARED',
    'APPROVED',
    'APPLIED'
  ];

  smartApplyForm: FormGroup =
    this.fb.group({
      source: [
        'LINKEDIN',
        Validators.required
      ],

      savedJobId: [''],

      jobUrl: [
        '',
        [
          Validators.required,
          this.urlValidator
        ]
      ],

      companyName: [
        '',
        Validators.required
      ],

      jobTitle: [
        '',
        Validators.required
      ],

      location: [''],

      workPreference: ['HYBRID'],

      jobDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(80)
        ]
      ],

      applicationMethod: [
        'LINKEDIN',
        Validators.required
      ],

      recruiterEmail: [
        '',
        Validators.email
      ],

      subject: [''],
      tailoredSummary: [''],
      tailoredCv: [''],
      coverLetter: [''],
      applicationEmail: ['']
    });

  private readonly subscriptions =
    new Subscription();

  constructor(
    private fb: FormBuilder,
    private smartApplyService:
      SmartApplyService
  ) {
    this.updateApplicationValidators(
      'LINKEDIN'
    );

    const methodSubscription =
      this.f['applicationMethod']
        .valueChanges
        .subscribe(
          (method: ApplicationMethod) => {
            this.updateApplicationValidators(
              method
            );
          }
        );

    this.subscriptions.add(
      methodSubscription
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get f(): Record<
    string,
    AbstractControl
  > {
    return this.smartApplyForm.controls;
  }

  get selectedMethod(): ApplicationMethod {
    return this.f['applicationMethod']
      .value as ApplicationMethod;
  }

  get actionLabel(): string {
    return this.selectedMethod === 'EMAIL'
      ? 'Approve & prepare email'
      : 'Approve & open application';
  }

  get completedStatusIndex(): number {
    return this.statusFlow.indexOf(
      this.applicationStatus
    );
  }

  selectSource(
    source: 'SAVED' | 'LINKEDIN' | 'INDEED'
  ): void {
    this.f['source'].setValue(source);

    if (
      source === 'LINKEDIN' ||
      source === 'INDEED'
    ) {
      this.f['applicationMethod']
        .setValue(source);
    }
  }

  loadDemoJob(): void {
    this.smartApplyForm.patchValue({
      source: 'LINKEDIN',

      jobUrl:
        'https://www.linkedin.com/jobs/view/example',

      companyName:
        'TechNova GmbH',

      jobTitle:
        'Senior Angular Developer',

      location:
        'Berlin, Germany',

      workPreference:
        'HYBRID',

      applicationMethod:
        'LINKEDIN',

      jobDescription:
        `We are looking for a Senior Angular Developer with strong Angular,
TypeScript, RxJS, Node.js and PostgreSQL experience. The candidate should have
experience designing REST APIs, building scalable web applications, using Git,
CI/CD and Docker. This is a full-time hybrid role based in Berlin.`
    });
  }

  analyzeJob(): void {
    const requiredFields = [
      'jobUrl',
      'companyName',
      'jobTitle',
      'jobDescription'
    ];

    requiredFields.forEach(field => {
      this.f[field].markAsTouched();
    });

    if (
      requiredFields.some(
        field => this.f[field].invalid
      )
    ) {
      return;
    }

    const request: AnalyzeJobRequest = {
      jobTitle:
        this.f['jobTitle'].value,

      companyName:
        this.f['companyName'].value,

      location:
        this.f['location'].value || '',

      workPreference:
        this.f['workPreference'].value || '',

      jobDescription:
        this.f['jobDescription'].value
    };

    /*
      Clear any documents generated for a previous
      analysis before starting a new one.
    */
    this.analysis = null;

    this.smartApplyForm.patchValue({
      tailoredSummary: '',
      tailoredCv: '',
      coverLetter: '',
      subject: '',
      applicationEmail: ''
    });

    this.currentStep = 1;
    this.applicationStatus = 'SAVED';
    this.isAnalyzing = true;

    const analysisSubscription =
      this.smartApplyService
        .analyzeJob(request)
        .pipe(
          finalize(() => {
            this.isAnalyzing = false;
          })
        )
        .subscribe({
          next: response => {
            this.analysis = response.data;

            this.f['tailoredSummary']
              .setValue(
                response.data
                  .recommendedSummary
              );

            this.currentStep = 2;
            this.applicationStatus =
              'ANALYZED';
          },

          error: error => {
            console.error(
              'Smart Apply analysis failed:',
              error
            );

            alert(
              error.error?.message ||
              'Unable to analyze this job right now.'
            );
          }
        });

    this.subscriptions.add(
      analysisSubscription
    );
  }

  prepareApplication(): void {
    if (!this.analysis) {
      alert(
        'Please analyze the job before preparing the application.'
      );

      return;
    }

    const request:
      GenerateApplicationRequest = {
        job: {
          jobTitle:
            this.f['jobTitle'].value,

          companyName:
            this.f['companyName'].value,

          location:
            this.f['location'].value ||
            '',

          workPreference:
            this.f['workPreference']
              .value || '',

          jobDescription:
            this.f['jobDescription'].value
        },

        analysis: this.analysis,

        tailoredSummary:
          this.f['tailoredSummary'].value ||
          this.analysis
            .recommendedSummary
      };

    this.isPreparing = true;

    const generationSubscription =
      this.smartApplyService
        .generateApplication(request)
        .pipe(
          finalize(() => {
            this.isPreparing = false;
          })
        )
        .subscribe({
          next: response => {
            this.smartApplyForm.patchValue({
              subject:
                response.data.subject,

              tailoredCv:
                response.data.tailoredCv,

              coverLetter:
                response.data.coverLetter,

              applicationEmail:
                response.data.applicationEmail
            });

            this.activeDocumentTab = 'cv';
            this.currentStep = 3;
            this.applicationStatus =
              'PREPARED';
          },

          error: error => {
            console.error(
              'Application generation failed:',
              error
            );

            alert(
              error.error?.message ||
              'Unable to prepare the application right now.'
            );
          }
        });

    this.subscriptions.add(
      generationSubscription
    );
  }

  setDocumentTab(
    tab: DocumentTab
  ): void {
    this.activeDocumentTab = tab;
  }

  regenerateDocument(): void {
    this.prepareApplication();
  }

  onResumeSelected(
    event: Event
  ): void {
    const input =
      event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (
      !this.allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        'Only PDF, DOC or DOCX files are allowed.'
      );

      input.value = '';
      this.selectedResume = null;

      return;
    }

    if (
      file.size >
      this.maxSizeMb * 1024 * 1024
    ) {
      alert(
        `File must be smaller than ${this.maxSizeMb} MB.`
      );

      input.value = '';
      this.selectedResume = null;

      return;
    }

    this.selectedResume = file;
  }

  removeResume(
    event?: Event
  ): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.selectedResume = null;
  }

  approveApplication(): void {
    if (
      !this.analysis ||
      this.applicationStatus !== 'PREPARED'
    ) {
      return;
    }

    const fields =
      this.selectedMethod === 'EMAIL'
        ? [
            'recruiterEmail',
            'subject',
            'applicationEmail'
          ]
        : ['jobUrl'];

    fields.forEach(field => {
      this.f[field].markAsTouched();
    });

    if (
      fields.some(
        field => this.f[field].invalid
      )
    ) {
      return;
    }

    this.isApproving = true;

    setTimeout(() => {
      this.isApproving = false;
      this.currentStep = 4;
      this.applicationStatus =
        'APPROVED';

      if (
        this.selectedMethod === 'EMAIL'
      ) {
        alert(
          'Application approved. Connect the backend email endpoint to send it.'
        );

        return;
      }

      const url =
        this.f['jobUrl'].value;

      window.open(
        url,
        '_blank',
        'noopener,noreferrer'
      );
    }, 500);
  }

  confirmSubmitted(): void {
    if (
      this.applicationStatus !==
      'APPROVED'
    ) {
      return;
    }

    this.applicationStatus = 'APPLIED';

    alert(
      'Application marked as submitted.'
    );
  }

  saveForLater(): void {
    alert(
      `Application saved with status: ${this.applicationStatus}`
    );
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

    this.isAnalyzing = false;
    this.isPreparing = false;
    this.isApproving = false;
  }

  private updateApplicationValidators(
    method: ApplicationMethod
  ): void {
    const email =
      this.f['recruiterEmail'];

    const url =
      this.f['jobUrl'];

    if (method === 'EMAIL') {
      email.setValidators([
        Validators.required,
        Validators.email
      ]);

      url.clearValidators();
    } else {
      email.setValidators([
        Validators.email
      ]);

      url.setValidators([
        Validators.required,
        this.urlValidator
      ]);
    }

    email.updateValueAndValidity({
      emitEvent: false
    });

    url.updateValueAndValidity({
      emitEvent: false
    });
  }

  private urlValidator(
    control: AbstractControl
  ): { invalidUrl: true } | null {
    if (!control.value) {
      return null;
    }

    try {
      const url =
        new URL(control.value);

      const validProtocol =
        url.protocol === 'http:' ||
        url.protocol === 'https:';

      return validProtocol
        ? null
        : { invalidUrl: true };
    } catch {
      return {
        invalidUrl: true
      };
    }
  }










  previewCv(): void {
  const cvText =
    this.f['tailoredCv'].value?.trim();

  if (!cvText) {
    alert(
      'Please generate the tailored CV first.'
    );

    return;
  }

  const pdf = this.createCvPdf();

  const pdfUrl =
    pdf.output('bloburl').toString();

  window.open(
    pdfUrl,
    '_blank',
    'noopener,noreferrer'
  );
}

downloadCv(): void {
  const cvText =
    this.f['tailoredCv'].value?.trim();

  if (!cvText) {
    alert(
      'Please generate the tailored CV first.'
    );

    return;
  }

  const companyName =
    this.createSafeFileName(
      this.f['companyName'].value
    );

  const jobTitle =
    this.createSafeFileName(
      this.f['jobTitle'].value
    );

  const fileName = [
    'Tailored_CV',
    companyName,
    jobTitle
  ]
    .filter(Boolean)
    .join('_');

  const pdf = this.createCvPdf();

  pdf.save(`${fileName}.pdf`);
}

private createCvPdf(): jsPDF {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const margin = 18;
  const contentWidth =
    pageWidth - margin * 2;

  const rawCv =
    this.f['tailoredCv'].value || '';

  const parsedCv =
    this.parseCvContent(rawCv);

  // Main colors
  const navy = {
    r: 18,
    g: 45,
    b: 67
  };

  const green = {
    r: 18,
    g: 145,
    b: 82
  };

  const darkText = {
    r: 45,
    g: 55,
    b: 65
  };

  const lightText = {
    r: 225,
    g: 235,
    b: 240
  };

  let yPosition = 0;

  /*
   * Header
   */
  pdf.setFillColor(
    navy.r,
    navy.g,
    navy.b
  );

  pdf.rect(
    0,
    0,
    pageWidth,
    42,
    'F'
  );

  // Green accent
  pdf.setFillColor(
    green.r,
    green.g,
    green.b
  );

  pdf.rect(
    0,
    0,
    5,
    42,
    'F'
  );

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(21);

  pdf.text(
    parsedCv.name || 'Candidate',
    margin,
    17
  );

  if (parsedCv.headline) {
    pdf.setFont(
      'helvetica',
      'normal'
    );

    pdf.setFontSize(11);

    pdf.setTextColor(
      lightText.r,
      lightText.g,
      lightText.b
    );

    pdf.text(
      parsedCv.headline,
      margin,
      25
    );
  }

  if (parsedCv.meta.length > 0) {
    const metaText =
      parsedCv.meta.join('  |  ');

    const metaLines =
      pdf.splitTextToSize(
        metaText,
        contentWidth
      ) as string[];

    pdf.setFontSize(8.5);

    pdf.text(
      metaLines,
      margin,
      33
    );
  }

  yPosition = 53;

  /*
   * Add a new page when necessary
   */
  const ensureSpace = (
    requiredSpace: number
  ): void => {
    if (
      yPosition + requiredSpace >
      pageHeight - 20
    ) {
      pdf.addPage();

      pdf.setFillColor(
        green.r,
        green.g,
        green.b
      );

      pdf.rect(
        0,
        0,
        pageWidth,
        3,
        'F'
      );

      yPosition = 18;
    }
  };

  /*
   * Render every CV section
   */
  parsedCv.sections.forEach(section => {
    ensureSpace(18);

    // Section heading
    pdf.setTextColor(
      navy.r,
      navy.g,
      navy.b
    );

    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setFontSize(11);

    pdf.text(
      section.title.toUpperCase(),
      margin,
      yPosition
    );

    // Heading underline
    pdf.setDrawColor(
      green.r,
      green.g,
      green.b
    );

    pdf.setLineWidth(0.6);

    pdf.line(
      margin,
      yPosition + 2.5,
      pageWidth - margin,
      yPosition + 2.5
    );

    yPosition += 9;

    let startOfGroup = true;

    section.lines.forEach(
      originalLine => {
        const line =
          this.normalizePdfText(
            originalLine
          );

        if (!line.trim()) {
          yPosition += 2;
          startOfGroup = true;
          return;
        }

        const isBullet =
          line.startsWith('- ') ||
          line.startsWith('• ');

        const text = isBullet
          ? line.substring(2).trim()
          : line.trim();

        /*
         * Bulleted content
         */
        if (isBullet) {
          const bulletX = margin + 2;
          const textX = margin + 7;

          const wrappedLines =
            pdf.splitTextToSize(
              text,
              contentWidth - 7
            ) as string[];

          ensureSpace(
            wrappedLines.length * 5 + 2
          );

          pdf.setFillColor(
            green.r,
            green.g,
            green.b
          );

          pdf.circle(
            bulletX,
            yPosition - 1.2,
            0.8,
            'F'
          );

          pdf.setTextColor(
            darkText.r,
            darkText.g,
            darkText.b
          );

          pdf.setFont(
            'helvetica',
            'normal'
          );

          pdf.setFontSize(9.5);

          pdf.text(
            wrappedLines,
            textX,
            yPosition
          );

          yPosition +=
            wrappedLines.length * 5;

          startOfGroup = false;
          return;
        }

        /*
         * Experience, education and certification titles
         */
        const sectionName =
          section.title.toLowerCase();

        const groupedSection =
          sectionName.includes(
            'experience'
          ) ||
          sectionName.includes(
            'education'
          ) ||
          sectionName.includes(
            'certification'
          );

        const useBold =
          groupedSection &&
          startOfGroup &&
          !this.looksLikeDate(text);

        const wrappedLines =
          pdf.splitTextToSize(
            text,
            contentWidth
          ) as string[];

        ensureSpace(
          wrappedLines.length * 5 + 2
        );

        pdf.setTextColor(
          darkText.r,
          darkText.g,
          darkText.b
        );

        pdf.setFont(
          'helvetica',
          useBold ? 'bold' : 'normal'
        );

        pdf.setFontSize(
          useBold ? 10.5 : 9.5
        );

        pdf.text(
          wrappedLines,
          margin,
          yPosition
        );

        yPosition +=
          wrappedLines.length * 5;

        startOfGroup = false;
      }
    );

    yPosition += 5;
  });

  /*
   * Page numbers and footer
   */
  const totalPages =
    pdf.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pdf.setPage(page);

    pdf.setDrawColor(220, 225, 230);
    pdf.setLineWidth(0.3);

    pdf.line(
      margin,
      pageHeight - 13,
      pageWidth - margin,
      pageHeight - 13
    );

    pdf.setFont(
      'helvetica',
      'normal'
    );

    pdf.setFontSize(8);

    pdf.setTextColor(120, 125, 130);

    pdf.text(
      `Tailored application | Page ${page} of ${totalPages}`,
      margin,
      pageHeight - 8
    );
  }

  return pdf;
}



private parseCvContent(
  cvText: string
): {
  name: string;
  headline: string;
  meta: string[];
  sections: Array<{
    title: string;
    lines: string[];
  }>;
} {
  const lines = cvText
    .replace(/\r/g, '')
    .split('\n')
    .map(line => line.trim());

  const knownHeadings = [
    'professional summary',
    'profile',
    'summary',
    'key skills',
    'core skills',
    'technical skills',
    'currently expanding skills',
    'currently expanding skills (learning/upskilling)',
    'professional experience',
    'work experience',
    'relevant experience',
    'education',
    'certifications',
    'languages',
    'projects',
    'additional notes'
  ];

  const preamble: string[] = [];

  const sections: Array<{
    title: string;
    lines: string[];
  }> = [];

  let currentSection: {
    title: string;
    lines: string[];
  } | null = null;

  lines.forEach(line => {
    const normalized =
      line
        .toLowerCase()
        .replace(/:$/, '')
        .trim();

    const isHeading =
      knownHeadings.includes(normalized);

    if (isHeading) {
      currentSection = {
        title: line.replace(/:$/, ''),
        lines: []
      };

      sections.push(currentSection);
      return;
    }

    if (currentSection) {
      currentSection.lines.push(line);
    } else if (line) {
      preamble.push(line);
    }
  });

  const name =(
  preamble[0] || ''
)
  .replace(/^name:\s*/i, '')
  .trim();

  const professionLine =
    preamble.find(line =>
      line.toLowerCase()
        .startsWith('profession:')
    );

  const headline =
    professionLine
      ? professionLine
          .replace(
            /^profession:\s*/i,
            ''
          )
      : '';

  const meta = preamble
    .slice(1)
    .filter(
      line => line !== professionLine
    )
    .map(line =>
      line
        .replace(/^location:\s*/i, '')
        .replace(
          /^work preference:\s*/i,
          ''
        )
    )
    .filter(Boolean);

  /*
   * Fallback if the AI returned text without
   * recognizable section headings.
   */
  if (sections.length === 0) {
    sections.push({
      title: 'Professional Profile',
      lines: lines.slice(1)
    });
  }

  return {
    name,
    headline,
    meta,
    sections
  };
}

private normalizePdfText(
  text: string
): string {
  return text
    .replace(/[–—]/g, '-')
    .replace(/•/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

private looksLikeDate(
  text: string
): boolean {
  return (
    /\b(19|20)\d{2}\b/.test(text) ||
    /\b(present|current)\b/i.test(text)
  );
}

private createSafeFileName(
  value: unknown
): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .trim()
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '');
}
}