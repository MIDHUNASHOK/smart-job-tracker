import { Injectable } from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  environment
} from '../../../environments/environment';

export interface ScoreBreakdown {
  overall: number;
  skills: number;
  experience: number;
  location: number;
  workPreference: number;
}

export interface SmartApplyAnalysis {
  scores: ScoreBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  strongExperienceEvidence: string[];
  cvImprovements: string[];
  recommendedSummary: string;
  interviewSuggestions: string[];
}

export interface AnalyzeJobRequest {
  jobTitle: string;
  companyName: string;
  location: string;
  workPreference: string;
  jobDescription: string;
}

export interface GeneratedApplication {
  subject: string;
  tailoredCv: string;
  coverLetter: string;
  applicationEmail: string;
}

export interface GenerateApplicationRequest {
  job: {
    jobTitle: string;
    companyName: string;
    location: string;
    workPreference: string;
    jobDescription: string;
  };

  analysis: SmartApplyAnalysis;
  tailoredSummary: string;
}

interface AnalyzeResponse {
  success: boolean;
  data: SmartApplyAnalysis;
}

interface GenerateApplicationResponse {
  success: boolean;
  data: GeneratedApplication;
}

@Injectable({
  providedIn: 'root'
})
export class SmartApplyService {
  private readonly apiUrl =
    `${environment.apiUrl}/smart-apply`;

  constructor(
    private http: HttpClient
  ) {}

  analyzeJob(
    data: AnalyzeJobRequest
  ): Observable<AnalyzeResponse> {
    return this.http.post<AnalyzeResponse>(
      `${this.apiUrl}/analyze`,
      data
    );
  }

  generateApplication(
    data: GenerateApplicationRequest
  ): Observable<GenerateApplicationResponse> {
    return this.http.post<GenerateApplicationResponse>(
      `${this.apiUrl}/generate`,
      data
    );
  }
}