import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl =
    environment.apiUrl + '/profile';

  constructor(
    private http: HttpClient
  ) {}

  // BASIC PROFILE

  getProfile() {

    return this.http.get(
      this.apiUrl
    );

  }

  saveProfile(data: any) {

    return this.http.put(
      this.apiUrl,
      data
    );

  }

  // SKILLS

  getSkills() {

    return this.http.get(
      `${this.apiUrl}/skills`
    );

  }

  addSkill(data: any) {

    return this.http.post(
      `${this.apiUrl}/skills`,
      data
    );

  }

  deleteSkill(id: string) {

    return this.http.delete(
      `${this.apiUrl}/skills/${id}`
    );

  }

  // EXPERIENCE

  getExperiences() {

    return this.http.get(
      `${this.apiUrl}/experiences`
    );

  }

  addExperience(data: any) {

    return this.http.post(
      `${this.apiUrl}/experiences`,
      data
    );

  }

  deleteExperience(id: string) {

    return this.http.delete(
      `${this.apiUrl}/experiences/${id}`
    );

  }

  // EDUCATION

  getEducations() {

    return this.http.get(
      `${this.apiUrl}/educations`
    );

  }

  addEducation(data: any) {

    return this.http.post(
      `${this.apiUrl}/educations`,
      data
    );

  }

  deleteEducation(id: string) {

    return this.http.delete(
      `${this.apiUrl}/educations/${id}`
    );

  }

  // CERTIFICATIONS

  getCertifications() {

    return this.http.get(
      `${this.apiUrl}/certifications`
    );

  }

  addCertification(data: any) {

    return this.http.post(
      `${this.apiUrl}/certifications`,
      data
    );

  }

  deleteCertification(id: string) {

    return this.http.delete(
      `${this.apiUrl}/certifications/${id}`
    );

  }

  // LANGUAGES

  getLanguages() {

    return this.http.get(
      `${this.apiUrl}/languages`
    );

  }

  addLanguage(data: any) {

    return this.http.post(
      `${this.apiUrl}/languages`,
      data
    );

  }

  deleteLanguage(id: string) {

    return this.http.delete(
      `${this.apiUrl}/languages/${id}`
    );

  }

}