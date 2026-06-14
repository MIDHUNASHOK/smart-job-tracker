import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  profile: any = {
    fullName: '',
    profession: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    avatarUrl: ''
  };

  skills: any[] = [];
  experiences: any[] = [];
  educations: any[] = [];
  certifications: any[] = [];
  languages: any[] = [];

  profileCompletion = 0;
  isSaving = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadSkills();
    this.loadExperiences();
    this.loadEducations();
    this.loadCertifications();
    this.loadLanguages();
  }

  trackById(index: number, item: any): string {
    return item?.id || index;
  }

  private removeDuplicates(items: any[], keys: string[]): any[] {
    const map = new Map<string, any>();

    items.forEach((item) => {
      const uniqueKey = keys
        .map((key) => String(item[key] || '').trim().toLowerCase())
        .join('|');

      if (!map.has(uniqueKey)) {
        map.set(uniqueKey, item);
      }
    });

    return Array.from(map.values());
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (response: any) => {
        this.profile = response.data || this.profile;
        this.calculateProfileCompletion();
      },
      error: (error) => console.log(error)
    });
  }

  saveProfile(): void {
    this.profileService.saveProfile(this.profile).subscribe({
      next: () => {
        alert('Profile saved successfully');
        this.calculateProfileCompletion();
      },
      error: (error) => console.log(error)
    });
  }

  loadSkills(): void {
    this.profileService.getSkills().subscribe({
      next: (response: any) => {
        this.skills = this.removeDuplicates(response.data || [], ['name']);
        this.calculateProfileCompletion();
      },
      error: (error) => console.log(error)
    });
  }

  addSkill(): void {
    const name = prompt('Enter skill name')?.trim();

    if (!name || this.isSaving) return;

    const alreadyExists = this.skills.some(
      skill => skill.name?.trim().toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      alert('This skill already exists');
      return;
    }

    this.isSaving = true;

    this.profileService.addSkill({ name }).subscribe({
      next: () => {
        this.isSaving = false;
        this.loadSkills();
      },
      error: (error) => {
        this.isSaving = false;
        console.log(error);
      }
    });
  }

  deleteSkill(id: string): void {
    if (!confirm('Delete this skill?')) return;

    this.profileService.deleteSkill(id).subscribe({
      next: () => this.loadSkills(),
      error: (error) => console.log(error)
    });
  }

  loadExperiences(): void {
    this.profileService.getExperiences().subscribe({
      next: (response: any) => {
        this.experiences = this.removeDuplicates(
          response.data || [],
          ['jobTitle', 'companyName', 'startDate', 'endDate']
        );
        this.calculateProfileCompletion();
      },
      error: (error) => console.log(error)
    });
  }

  addExperience(): void {
    const jobTitle = prompt('Enter job title')?.trim();
    const companyName = prompt('Enter company name')?.trim();
    const startDate = prompt('Enter start date')?.trim();
    const endDate = prompt('Enter end date')?.trim();
    const description = prompt('Enter description')?.trim();

    if (!jobTitle || !companyName || !startDate || this.isSaving) return;

    const alreadyExists = this.experiences.some(
      exp =>
        exp.jobTitle?.trim().toLowerCase() === jobTitle.toLowerCase() &&
        exp.companyName?.trim().toLowerCase() === companyName.toLowerCase() &&
        String(exp.startDate || '').trim() === startDate
    );

    if (alreadyExists) {
      alert('This experience already exists');
      return;
    }

    this.isSaving = true;

    this.profileService.addExperience({
      jobTitle,
      companyName,
      startDate,
      endDate,
      description
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.loadExperiences();
      },
      error: (error) => {
        this.isSaving = false;
        console.log(error);
      }
    });
  }

  deleteExperience(id: string): void {
    if (!confirm('Delete this experience?')) return;

    this.profileService.deleteExperience(id).subscribe({
      next: () => this.loadExperiences(),
      error: (error) => console.log(error)
    });
  }

  loadEducations(): void {
    this.profileService.getEducations().subscribe({
      next: (response: any) => {
        this.educations = this.removeDuplicates(
          response.data || [],
          ['degree', 'institute', 'startYear', 'endYear']
        );
        this.calculateProfileCompletion();
      },
      error: (error) => console.log(error)
    });
  }

  addEducation(): void {
    const degree = prompt('Enter degree')?.trim();
    const institute = prompt('Enter institute')?.trim();
    const startYear = prompt('Enter start year')?.trim();
    const endYear = prompt('Enter end year')?.trim();

    if (!degree || !institute || this.isSaving) return;

    const alreadyExists = this.educations.some(
      edu =>
        edu.degree?.trim().toLowerCase() === degree.toLowerCase() &&
        edu.institute?.trim().toLowerCase() === institute.toLowerCase() &&
        String(edu.startYear || '').trim() === startYear &&
        String(edu.endYear || '').trim() === endYear
    );

    if (alreadyExists) {
      alert('This education already exists');
      return;
    }

    this.isSaving = true;

    this.profileService.addEducation({
      degree,
      institute,
      startYear,
      endYear
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.loadEducations();
      },
      error: (error) => {
        this.isSaving = false;
        console.log(error);
      }
    });
  }

  deleteEducation(id: string): void {
    if (!confirm('Delete this education?')) return;

    this.profileService.deleteEducation(id).subscribe({
      next: () => this.loadEducations(),
      error: (error) => console.log(error)
    });
  }

  loadCertifications(): void {
    this.profileService.getCertifications().subscribe({
      next: (response: any) => {
        this.certifications = this.removeDuplicates(
          response.data || [],
          ['name', 'issuer', 'year']
        );
        this.calculateProfileCompletion();
      },
      error: (error) => console.log(error)
    });
  }

  addCertification(): void {
    const name = prompt('Enter certification name')?.trim();
    const issuer = prompt('Enter issuer')?.trim();
    const year = prompt('Enter year')?.trim();

    if (!name || this.isSaving) return;

    const alreadyExists = this.certifications.some(
      cert =>
        cert.name?.trim().toLowerCase() === name.toLowerCase() &&
        String(cert.issuer || '').trim().toLowerCase() === String(issuer || '').toLowerCase() &&
        String(cert.year || '').trim() === String(year || '').trim()
    );

    if (alreadyExists) {
      alert('This certification already exists');
      return;
    }

    this.isSaving = true;

    this.profileService.addCertification({
      name,
      issuer,
      year
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.loadCertifications();
      },
      error: (error) => {
        this.isSaving = false;
        console.log(error);
      }
    });
  }

  deleteCertification(id: string): void {
    if (!confirm('Delete this certification?')) return;

    this.profileService.deleteCertification(id).subscribe({
      next: () => this.loadCertifications(),
      error: (error) => console.log(error)
    });
  }

  loadLanguages(): void {
    this.profileService.getLanguages().subscribe({
      next: (response: any) => {
        this.languages = this.removeDuplicates(
          response.data || [],
          ['name', 'level']
        );
        this.calculateProfileCompletion();
      },
      error: (error) => console.log(error)
    });
  }

  addLanguage(): void {
    const name = prompt('Enter language name')?.trim();
    const level = prompt('Enter level')?.trim();

    if (!name || !level || this.isSaving) return;

    const alreadyExists = this.languages.some(
      lang =>
        lang.name?.trim().toLowerCase() === name.toLowerCase() &&
        lang.level?.trim().toLowerCase() === level.toLowerCase()
    );

    if (alreadyExists) {
      alert('This language already exists');
      return;
    }

    this.isSaving = true;

    this.profileService.addLanguage({
      name,
      level
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.loadLanguages();
      },
      error: (error) => {
        this.isSaving = false;
        console.log(error);
      }
    });
  }

  deleteLanguage(id: string): void {
    if (!confirm('Delete this language?')) return;

    this.profileService.deleteLanguage(id).subscribe({
      next: () => this.loadLanguages(),
      error: (error) => console.log(error)
    });
  }

  calculateProfileCompletion(): void {
    const fields = [
      this.profile.fullName,
      this.profile.profession,
      this.profile.email,
      this.profile.phone,
      this.profile.location,
      this.profile.linkedin,
      this.profile.github,
      this.profile.summary,
      this.skills.length > 0 ? 'skills' : '',
      this.experiences.length > 0 ? 'experience' : '',
      this.educations.length > 0 ? 'education' : '',
      this.certifications.length > 0 ? 'certification' : '',
      this.languages.length > 0 ? 'language' : ''
    ];

    const completedFields = fields.filter((field) => field).length;

    this.profileCompletion = Math.round(
      (completedFields / fields.length) * 100
    );
  }





//   profileImagePreview: string | ArrayBuffer | null = null;
// selectedProfileImage: File | null = null;

// onProfileImageSelected(event: Event): void {
//   const input = event.target as HTMLInputElement;

//   if (!input.files || input.files.length === 0) {
//     return;
//   }

//   const file = input.files[0];

//   if (!file.type.startsWith('image/')) {
//     alert('Please select a valid image file');
//     return;
//   }

//   this.selectedProfileImage = file;

//   const reader = new FileReader();

//   reader.onload = () => {
//     this.profileImagePreview = reader.result;
//   };

//   reader.readAsDataURL(file);
// }
}