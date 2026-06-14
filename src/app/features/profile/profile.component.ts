import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Interfaces
interface Profile {
  fullName: string;
  profession: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  avatarUrl: string;
}

interface Skill {
  id: string;
  name: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institute: string;
  startYear: string;
  endYear?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer?: string;
  year?: string;
}

interface Language {
  id: string;
  name: string;
  level: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // Data
  profile: Profile = {
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

  skills: Skill[] = [];
  experiences: Experience[] = [];
  educations: Education[] = [];
  certifications: Certification[] = [];
  languages: Language[] = [];

  // UI State
  profileCompletion = 0;
  loading = {
    profile: false,
    skills: false,
    experiences: false,
    educations: false,
    certifications: false,
    languages: false,
    saving: false
  };

  // Modal forms
  showSkillModal = false;
  showExperienceModal = false;
  showEducationModal = false;
  showCertificationModal = false;
  showLanguageModal = false;

  newSkill = { name: '' };
  newExperience: Partial<Experience> = {};
  newEducation: Partial<Education> = {};
  newCertification: Partial<Certification> = {};
  newLanguage: Partial<Language> = {};

  // Toast notifications
  toast = { show: false, message: '', type: 'success' };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  // ─────────────────────────────────────────────
  // DATA LOADING
  // ─────────────────────────────────────────────

  loadAllData(): void {
    this.loadProfile();
    this.loadSkills();
    this.loadExperiences();
    this.loadEducations();
    this.loadCertifications();
    this.loadLanguages();
  }

  loadProfile(): void {
    this.loading.profile = true;
    this.profileService.getProfile().subscribe({
      next: (response: any) => {
        this.profile = { ...this.profile, ...response.data };
        this.loading.profile = false;
        this.calculateProfileCompletion();
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
        this.loading.profile = false;
        this.showToast('Failed to load profile', 'error');
      }
    });
  }

  loadSkills(): void {
    this.loading.skills = true;
    this.profileService.getSkills().subscribe({
      next: (response: any) => {
        this.skills = response.data || [];
        this.loading.skills = false;
        this.calculateProfileCompletion();
      },
      error: (error) => {
        console.error('Failed to load skills:', error);
        this.loading.skills = false;
      }
    });
  }

  loadExperiences(): void {
    this.loading.experiences = true;
    this.profileService.getExperiences().subscribe({
      next: (response: any) => {
        this.experiences = response.data || [];
        this.loading.experiences = false;
        this.calculateProfileCompletion();
      },
      error: (error) => {
        console.error('Failed to load experiences:', error);
        this.loading.experiences = false;
      }
    });
  }

  loadEducations(): void {
    this.loading.educations = true;
    this.profileService.getEducations().subscribe({
      next: (response: any) => {
        this.educations = response.data || [];
        this.loading.educations = false;
        this.calculateProfileCompletion();
      },
      error: (error) => {
        console.error('Failed to load educations:', error);
        this.loading.educations = false;
      }
    });
  }

  loadCertifications(): void {
    this.loading.certifications = true;
    this.profileService.getCertifications().subscribe({
      next: (response: any) => {
        this.certifications = response.data || [];
        this.loading.certifications = false;
        this.calculateProfileCompletion();
      },
      error: (error) => {
        console.error('Failed to load certifications:', error);
        this.loading.certifications = false;
      }
    });
  }

  loadLanguages(): void {
    this.loading.languages = true;
    this.profileService.getLanguages().subscribe({
      next: (response: any) => {
        this.languages = response.data || [];
        this.loading.languages = false;
        this.calculateProfileCompletion();
      },
      error: (error) => {
        console.error('Failed to load languages:', error);
        this.loading.languages = false;
      }
    });
  }

  // ─────────────────────────────────────────────
  // SAVE PROFILE
  // ─────────────────────────────────────────────

  saveProfile(): void {
    this.loading.saving = true;
    this.profileService.saveProfile(this.profile).subscribe({
      next: () => {
        this.loading.saving = false;
        this.showToast('Profile saved successfully!', 'success');
        this.calculateProfileCompletion();
      },
      error: (error) => {
        console.error('Failed to save profile:', error);
        this.loading.saving = false;
        this.showToast('Failed to save profile', 'error');
      }
    });
  }

  // ─────────────────────────────────────────────
  // SKILLS
  // ─────────────────────────────────────────────

  openSkillModal(): void {
    this.newSkill = { name: '' };
    this.showSkillModal = true;
  }

  closeSkillModal(): void {
    this.showSkillModal = false;
  }

  submitSkill(): void {
    if (!this.newSkill.name.trim()) return;

    this.profileService.addSkill(this.newSkill).subscribe({
      next: () => {
        this.loadSkills();
        this.closeSkillModal();
        this.showToast('Skill added!', 'success');
      },
      error: (error) => {
        console.error('Failed to add skill:', error);
        this.showToast('Failed to add skill', 'error');
      }
    });
  }

  deleteSkill(id: string): void {
    this.profileService.deleteSkill(id).subscribe({
      next: () => {
        this.loadSkills();
        this.showToast('Skill removed', 'success');
      },
      error: (error) => {
        console.error('Failed to delete skill:', error);
        this.showToast('Failed to delete skill', 'error');
      }
    });
  }

  // ─────────────────────────────────────────────
  // EXPERIENCE
  // ─────────────────────────────────────────────

  openExperienceModal(): void {
    this.newExperience = {
      jobTitle: '',
      companyName: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    this.showExperienceModal = true;
  }

  closeExperienceModal(): void {
    this.showExperienceModal = false;
  }

  submitExperience(): void {
    if (!this.newExperience.jobTitle?.trim() || 
        !this.newExperience.companyName?.trim() || 
        !this.newExperience.startDate) {
      this.showToast('Please fill required fields', 'error');
      return;
    }

    this.profileService.addExperience(this.newExperience).subscribe({
      next: () => {
        this.loadExperiences();
        this.closeExperienceModal();
        this.showToast('Experience added!', 'success');
      },
      error: (error) => {
        console.error('Failed to add experience:', error);
        this.showToast('Failed to add experience', 'error');
      }
    });
  }

  deleteExperience(id: string): void {
    this.profileService.deleteExperience(id).subscribe({
      next: () => {
        this.loadExperiences();
        this.showToast('Experience removed', 'success');
      },
      error: (error) => {
        console.error('Failed to delete experience:', error);
        this.showToast('Failed to delete experience', 'error');
      }
    });
  }

  // ─────────────────────────────────────────────
  // EDUCATION
  // ─────────────────────────────────────────────

  openEducationModal(): void {
    this.newEducation = {
      degree: '',
      institute: '',
      startYear: '',
      endYear: ''
    };
    this.showEducationModal = true;
  }

  closeEducationModal(): void {
    this.showEducationModal = false;
  }

  submitEducation(): void {
    if (!this.newEducation.degree?.trim() || !this.newEducation.institute?.trim()) {
      this.showToast('Please fill required fields', 'error');
      return;
    }

    this.profileService.addEducation(this.newEducation).subscribe({
      next: () => {
        this.loadEducations();
        this.closeEducationModal();
        this.showToast('Education added!', 'success');
      },
      error: (error) => {
        console.error('Failed to add education:', error);
        this.showToast('Failed to add education', 'error');
      }
    });
  }

  deleteEducation(id: string): void {
    this.profileService.deleteEducation(id).subscribe({
      next: () => {
        this.loadEducations();
        this.showToast('Education removed', 'success');
      },
      error: (error) => {
        console.error('Failed to delete education:', error);
        this.showToast('Failed to delete education', 'error');
      }
    });
  }

  // ─────────────────────────────────────────────
  // CERTIFICATIONS
  // ─────────────────────────────────────────────

  openCertificationModal(): void {
    this.newCertification = { name: '', issuer: '', year: '' };
    this.showCertificationModal = true;
  }

  closeCertificationModal(): void {
    this.showCertificationModal = false;
  }

  submitCertification(): void {
    if (!this.newCertification.name?.trim()) {
      this.showToast('Please enter certification name', 'error');
      return;
    }

    this.profileService.addCertification(this.newCertification).subscribe({
      next: () => {
        this.loadCertifications();
        this.closeCertificationModal();
        this.showToast('Certification added!', 'success');
      },
      error: (error) => {
        console.error('Failed to add certification:', error);
        this.showToast('Failed to add certification', 'error');
      }
    });
  }

  deleteCertification(id: string): void {
    this.profileService.deleteCertification(id).subscribe({
      next: () => {
        this.loadCertifications();
        this.showToast('Certification removed', 'success');
      },
      error: (error) => {
        console.error('Failed to delete certification:', error);
        this.showToast('Failed to delete certification', 'error');
      }
    });
  }

  // ─────────────────────────────────────────────
  // LANGUAGES
  // ─────────────────────────────────────────────

  openLanguageModal(): void {
    this.newLanguage = { name: '', level: '' };
    this.showLanguageModal = true;
  }

  closeLanguageModal(): void {
    this.showLanguageModal = false;
  }

  submitLanguage(): void {
    if (!this.newLanguage.name?.trim() || !this.newLanguage.level?.trim()) {
      this.showToast('Please fill all fields', 'error');
      return;
    }

    this.profileService.addLanguage(this.newLanguage).subscribe({
      next: () => {
        this.loadLanguages();
        this.closeLanguageModal();
        this.showToast('Language added!', 'success');
      },
      error: (error) => {
        console.error('Failed to add language:', error);
        this.showToast('Failed to add language', 'error');
      }
    });
  }

  deleteLanguage(id: string): void {
    this.profileService.deleteLanguage(id).subscribe({
      next: () => {
        this.loadLanguages();
        this.showToast('Language removed', 'success');
      },
      error: (error) => {
        console.error('Failed to delete language:', error);
        this.showToast('Failed to delete language', 'error');
      }
    });
  }

  // ─────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────

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
      this.skills.length > 0,
      this.experiences.length > 0,
      this.educations.length > 0,
      this.certifications.length > 0,
      this.languages.length > 0
    ];

    const completed = fields.filter(Boolean).length;
    this.profileCompletion = Math.round((completed / fields.length) * 100);
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { show: true, message, type };
    setTimeout(() => {
      this.toast.show = false;
    }, 3000);
  }

  get completionColor(): string {
    if (this.profileCompletion >= 80) return 'success';
    if (this.profileCompletion >= 50) return 'warning';
    return 'danger';
  }




















  generateResume(): void {
    const validationError = this.validateResume();
  
    if (validationError) {
      this.showToast(validationError, 'error');
      return;
    }
  
    const doc = new jsPDF('p', 'mm', 'a4');
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    const marginLeft = 18;
    const marginRight = 18;
    const contentWidth = pageWidth - marginLeft - marginRight;
  
    let y = 18;
  
    const checkPageBreak = (neededHeight: number = 15) => {
      if (y + neededHeight > pageHeight - 18) {
        doc.addPage();
        y = 18;
      }
    };
  
    const addSectionTitle = (title: string) => {
      checkPageBreak(14);
  
      y += 6;
  
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(title.toUpperCase(), marginLeft, y);
  
      y += 2;
  
      doc.setDrawColor(40, 40, 40);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
  
      y += 6;
    };
  
    const addWrappedText = (
      text: string,
      fontSize: number = 10,
      isBold: boolean = false,
      lineHeight: number = 5
    ) => {
      if (!text) return;
  
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(fontSize);
  
      const lines = doc.splitTextToSize(text, contentWidth);
  
      checkPageBreak(lines.length * lineHeight);
  
      doc.text(lines, marginLeft, y);
  
      y += lines.length * lineHeight;
    };
  
    const clean = (value: any): string => {
      return String(value || '').trim();
    };
  
    const formatDateRange = (start: any, end: any): string => {
      const startText = clean(start);
      const endText = clean(end) || 'Present';
  
      if (!startText && !endText) return '';
      return `${startText} - ${endText}`;
    };
  
    const uniqueSkills = Array.from(
      new Set(
        this.skills
          .map(skill => clean(skill.name))
          .filter(Boolean)
          .map(skill => skill.toLowerCase())
      )
    ).map(skill => skill.charAt(0).toUpperCase() + skill.slice(1));
  
    // HEADER
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(clean(this.profile.fullName).toUpperCase(), marginLeft, y);
  
    y += 7;
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(clean(this.profile.profession), marginLeft, y);
  
    y += 7;
  
    const contactInfo = [
      clean(this.profile.location),
      clean(this.profile.phone),
      clean(this.profile.email)
    ].filter(Boolean).join(' | ');
  
    doc.setFontSize(9.5);
    doc.text(contactInfo, marginLeft, y);
  
    y += 5;
  
    if (this.profile.linkedin) {
      doc.text(`LinkedIn: ${clean(this.profile.linkedin)}`, marginLeft, y);
      y += 5;
    }
  
    if (this.profile.github) {
      doc.text(`GitHub: ${clean(this.profile.github)}`, marginLeft, y);
      y += 5;
    }
  
    // SUMMARY
    if (this.profile.summary) {
      addSectionTitle('Professional Summary');
      addWrappedText(clean(this.profile.summary), 10, false, 5);
    }
  
    // SKILLS
    if (uniqueSkills.length > 0) {
      addSectionTitle('Core Skills');
  
      const skillText = uniqueSkills.join(' • ');
      addWrappedText(skillText, 10, false, 5);
    }
  
    // EXPERIENCE
    if (this.experiences.length > 0) {
      addSectionTitle('Professional Experience');
  
      this.experiences.forEach((exp) => {
        checkPageBreak(28);
  
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.text(clean(exp.jobTitle).toUpperCase(), marginLeft, y);
        y += 5;
  
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(clean(exp.companyName), marginLeft, y);
        y += 5;
  
        const duration = formatDateRange(exp.startDate, exp.endDate);
        if (duration) {
          doc.setFontSize(9.5);
          doc.text(duration, marginLeft, y);
          y += 5;
        }
  
        if (exp.description) {
          const descriptionLines = clean(exp.description)
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
  
          descriptionLines.forEach(line => {
            checkPageBreak(8);
  
            const bulletText = `• ${line}`;
            const bulletLines = doc.splitTextToSize(bulletText, contentWidth);
  
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.text(bulletLines, marginLeft, y);
  
            y += bulletLines.length * 5;
          });
        }
  
        y += 4;
      });
    }
  
    // EDUCATION
    if (this.educations.length > 0) {
      addSectionTitle('Education');
  
      this.educations.forEach((edu) => {
        checkPageBreak(18);
  
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(clean(edu.degree), marginLeft, y);
        y += 5;
  
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.text(clean(edu.institute), marginLeft, y);
        y += 5;
  
        const year = formatDateRange(edu.startYear, edu.endYear);
        if (year) {
          doc.text(year, marginLeft, y);
          y += 5;
        }
  
        y += 2;
      });
    }
  
    // CERTIFICATIONS
    if (this.certifications.length > 0) {
      addSectionTitle('Certifications');
  
      this.certifications.forEach((cert) => {
        checkPageBreak(8);
  
        const certText = [
          clean(cert.name),
          clean(cert.issuer),
          clean(cert.year)
        ].filter(Boolean).join(' - ');
  
        addWrappedText(`• ${certText}`, 9.5, false, 5);
      });
    }
  
    // LANGUAGES
    if (this.languages.length > 0) {
      addSectionTitle('Languages');
  
      const languageText = this.languages
        .map(lang => `${clean(lang.name)} - ${clean(lang.level)}`)
        .filter(Boolean)
        .join(' • ');
  
      addWrappedText(languageText, 9.5, false, 5);
    }
  
    const fileName = `${clean(this.profile.fullName) || 'resume'}-ats-resume.pdf`;
    doc.save(fileName);
  }



  validateResume(): string | null {
    if (!this.profile.fullName?.trim()) {
      return 'Full name is required';
    }
  
    if (!this.profile.profession?.trim()) {
      return 'Profession is required';
    }
  
    if (!this.profile.email?.trim() && !this.profile.phone?.trim()) {
      return 'Email or phone number is required';
    }
  
    if (!this.profile.summary?.trim()) {
      return 'Professional summary is required';
    }
  
    if (this.skills.length < 3) {
      return 'Please add at least 3 skills';
    }
  
    if (this.experiences.length === 0) {
      return 'Please add at least one work experience';
    }
  
    if (this.educations.length === 0) {
      return 'Please add education details';
    }
  
    return null;
  }

}
