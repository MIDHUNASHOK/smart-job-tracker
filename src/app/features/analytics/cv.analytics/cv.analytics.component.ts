
import { Component } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

interface AnalysisResult {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  resumeWordCount: number;
  jobDescriptionWordCount: number;
}

@Component({
  selector: 'app-cv.analytics',
  templateUrl: './cv.analytics.component.html',
  styleUrl: './cv.analytics.component.scss'
})
export class CvAnalyticsComponent {

  selectedFile: File | null = null;
  selectedFileName = '';

  jobDescription = '';
  resumeText = '';

  isDragging = false;
  isAnalyzing = false;
  showResults = false;

  errorMessage = '';

  atsScore = 0;
  matchedKeywords: string[] = [];
  missingKeywords: string[] = [];
  suggestions: string[] = [];

  resumeWordCount = 0;
  jobDescriptionWordCount = 0;

  private readonly allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  private readonly ignoredWords = new Set([
    'a',
    'an',
    'and',
    'are',
    'as',
    'at',
    'be',
    'been',
    'being',
    'but',
    'by',
    'can',
    'for',
    'from',
    'has',
    'have',
    'having',
    'he',
    'her',
    'his',
    'i',
    'in',
    'into',
    'is',
    'it',
    'its',
    'job',
    'of',
    'on',
    'or',
    'our',
    'that',
    'the',
    'their',
    'them',
    'they',
    'this',
    'to',
    'we',
    'will',
    'with',
    'you',
    'your',
    'years',
    'year',
    'work',
    'working',
    'role',
    'candidate',
    'required',
    'preferred',
    'responsibilities',
    'requirements'
  ]);

  constructor() {
    /*
     * PDF.js requires a worker.
     * This URL loads the worker matching the installed PDF.js version.
     */
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/` +
      `${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  // ─────────────────────────────────────────────
  // FILE SELECTION
  // ─────────────────────────────────────────────

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.setSelectedFile(input.files[0]);

    // Allows selecting the same file again.
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.setSelectedFile(file);
    }
  }

  private setSelectedFile(file: File): void {
    this.resetResults();
    this.errorMessage = '';

    const extension = this.getFileExtension(file.name);

    const validExtension =
      extension === 'pdf' || extension === 'docx';

    const validMimeType =
      this.allowedTypes.includes(file.type) || validExtension;

    if (!validMimeType) {
      this.errorMessage =
        'Only PDF and DOCX resume files are supported.';
      return;
    }

    const maximumSize = 5 * 1024 * 1024;

    if (file.size > maximumSize) {
      this.errorMessage =
        'The resume file must be smaller than 5 MB.';
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.resumeText = '';
    this.resetResults();
  }

  // ─────────────────────────────────────────────
  // ANALYSIS
  // ─────────────────────────────────────────────

  async analyzeResume(): Promise<void> {
    this.errorMessage = '';
    this.resetResults();

    if (!this.selectedFile) {
      this.errorMessage = 'Please upload your resume.';
      return;
    }

    if (!this.jobDescription.trim()) {
      this.errorMessage = 'Please enter the job description.';
      return;
    }

    if (this.jobDescription.trim().length < 50) {
      this.errorMessage =
        'Please enter a more complete job description.';
      return;
    }

    this.isAnalyzing = true;

    try {
      this.resumeText = await this.extractTextFromFile(
        this.selectedFile
      );

      if (!this.resumeText.trim()) {
        throw new Error(
          'No readable text was found in the resume.'
        );
      }

      const result = this.calculateAnalysis(
        this.resumeText,
        this.jobDescription
      );

      this.atsScore = result.atsScore;
      this.matchedKeywords = result.matchedKeywords;
      this.missingKeywords = result.missingKeywords;
      this.suggestions = result.suggestions;
      this.resumeWordCount = result.resumeWordCount;
      this.jobDescriptionWordCount =
        result.jobDescriptionWordCount;

      this.showResults = true;
    } catch (error) {
      console.error('Resume analysis failed:', error);

      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to analyze the resume.';
    } finally {
      this.isAnalyzing = false;
    }
  }

  // ─────────────────────────────────────────────
  // TEXT EXTRACTION
  // ─────────────────────────────────────────────

  private async extractTextFromFile(
    file: File
  ): Promise<string> {
    const extension = this.getFileExtension(file.name);

    if (extension === 'pdf') {
      return this.extractPdfText(file);
    }

    if (extension === 'docx') {
      return this.extractDocxText(file);
    }

    throw new Error('Unsupported resume format.');
  }

  private async extractPdfText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer
    });

    const pdf = await loadingTask.promise;

    const pageTexts: string[] = [];

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');

      pageTexts.push(pageText);
    }

    return pageTexts.join('\n');
  }

  private async extractDocxText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({
      arrayBuffer
    });

    return result.value || '';
  }

  // ─────────────────────────────────────────────
  // ATS CALCULATION
  // ─────────────────────────────────────────────

  private calculateAnalysis(
    resumeText: string,
    jobDescription: string
  ): AnalysisResult {
    const normalizedResume =
      this.normalizeText(resumeText);

    const normalizedJobDescription =
      this.normalizeText(jobDescription);

    const resumeWords =
      this.getWords(normalizedResume);

    const jobWords =
      this.getWords(normalizedJobDescription);

    const resumeWordSet = new Set(resumeWords);

    const jobKeywords =
      this.extractImportantKeywords(jobWords);

    const matchedKeywords = jobKeywords.filter(keyword =>
      this.containsKeyword(normalizedResume, resumeWordSet, keyword)
    );

    const missingKeywords = jobKeywords.filter(keyword =>
      !this.containsKeyword(normalizedResume, resumeWordSet, keyword)
    );

    const keywordScore =
      jobKeywords.length > 0
        ? (matchedKeywords.length / jobKeywords.length) * 70
        : 0;

    const sectionScore =
      this.calculateSectionScore(normalizedResume);

    const lengthScore =
      this.calculateResumeLengthScore(resumeWords.length);

    const contactScore =
      this.calculateContactScore(resumeText);

    const finalScore = Math.min(
      100,
      Math.round(
        keywordScore +
        sectionScore +
        lengthScore +
        contactScore
      )
    );

    return {
      atsScore: finalScore,
      matchedKeywords: matchedKeywords.slice(0, 20),
      missingKeywords: missingKeywords.slice(0, 20),
      suggestions: this.generateSuggestions(
        normalizedResume,
        resumeText,
        missingKeywords,
        resumeWords.length
      ),
      resumeWordCount: resumeWords.length,
      jobDescriptionWordCount: jobWords.length
    };
  }

  private extractImportantKeywords(
    words: string[]
  ): string[] {
    const frequency = new Map<string, number>();

    words.forEach(word => {
      if (
        word.length < 3 ||
        this.ignoredWords.has(word) ||
        /^\d+$/.test(word)
      ) {
        return;
      }

      frequency.set(
        word,
        (frequency.get(word) || 0) + 1
      );
    });

    return Array.from(frequency.entries())
      .sort((first, second) => {
        if (second[1] !== first[1]) {
          return second[1] - first[1];
        }

        return second[0].length - first[0].length;
      })
      .slice(0, 30)
      .map(([word]) => word);
  }

  private containsKeyword(
    resumeText: string,
    resumeWords: Set<string>,
    keyword: string
  ): boolean {
    if (keyword.includes(' ')) {
      return resumeText.includes(keyword);
    }

    return resumeWords.has(keyword);
  }

  private calculateSectionScore(
    resumeText: string
  ): number {
    const sections = [
      ['summary', 'profile', 'objective'],
      ['experience', 'employment', 'work history'],
      ['education', 'academic'],
      ['skills', 'technical skills', 'core skills']
    ];

    const foundSections = sections.filter(sectionNames =>
      sectionNames.some(section =>
        resumeText.includes(section)
      )
    ).length;

    return (foundSections / sections.length) * 12;
  }

  private calculateResumeLengthScore(
    wordCount: number
  ): number {
    if (wordCount >= 350 && wordCount <= 900) {
      return 8;
    }

    if (
      (wordCount >= 250 && wordCount < 350) ||
      (wordCount > 900 && wordCount <= 1100)
    ) {
      return 5;
    }

    if (wordCount >= 150) {
      return 3;
    }

    return 0;
  }

  private calculateContactScore(
    originalResumeText: string
  ): number {
    const emailPattern =
      /[\w.+-]+@[\w-]+\.[\w.-]+/i;

    const phonePattern =
      /(?:\+?\d[\d\s().-]{7,}\d)/;

    let score = 0;

    if (emailPattern.test(originalResumeText)) {
      score += 5;
    }

    if (phonePattern.test(originalResumeText)) {
      score += 5;
    }

    return score;
  }

  // ─────────────────────────────────────────────
  // SUGGESTIONS
  // ─────────────────────────────────────────────

  private generateSuggestions(
    normalizedResume: string,
    originalResumeText: string,
    missingKeywords: string[],
    resumeWordCount: number
  ): string[] {
    const suggestions: string[] = [];

    if (missingKeywords.length > 0) {
      suggestions.push(
        `Add relevant missing keywords such as: ` +
        `${missingKeywords.slice(0, 5).join(', ')}.`
      );
    }

    if (
      !normalizedResume.includes('summary') &&
      !normalizedResume.includes('profile')
    ) {
      suggestions.push(
        'Add a short professional summary tailored to the target role.'
      );
    }

    if (
      !normalizedResume.includes('skills') &&
      !normalizedResume.includes('technical skills')
    ) {
      suggestions.push(
        'Add a clearly labelled skills section.'
      );
    }

    if (
      !normalizedResume.includes('experience') &&
      !normalizedResume.includes('employment')
    ) {
      suggestions.push(
        'Add a clearly labelled professional experience section.'
      );
    }

    if (resumeWordCount < 300) {
      suggestions.push(
        'Your resume may be too short. Add measurable achievements and relevant project details.'
      );
    }

    if (resumeWordCount > 1000) {
      suggestions.push(
        'Your resume may be too long. Remove unrelated or repeated information.'
      );
    }

    const measurableAchievementPattern =
      /\b\d+(?:\.\d+)?%|\b\d+\+|\b€\s?\d+|\b\$\s?\d+/;

    if (
      !measurableAchievementPattern.test(originalResumeText)
    ) {
      suggestions.push(
        'Include measurable achievements using numbers, percentages or project results.'
      );
    }

    const actionVerbs = [
      'developed',
      'implemented',
      'designed',
      'created',
      'improved',
      'managed',
      'led',
      'optimized',
      'delivered',
      'built'
    ];

    const hasActionVerb = actionVerbs.some(verb =>
      normalizedResume.includes(verb)
    );

    if (!hasActionVerb) {
      suggestions.push(
        'Begin experience bullet points with strong action verbs such as Developed, Implemented or Improved.'
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        'Your resume has a strong basic structure. Review every section and tailor it to the specific job.'
      );
    }

    return suggestions.slice(0, 6);
  }

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────

  getScoreLabel(): string {
    if (this.atsScore >= 80) {
      return 'Excellent Match';
    }

    if (this.atsScore >= 65) {
      return 'Good Match';
    }

    if (this.atsScore >= 45) {
      return 'Needs Improvement';
    }

    return 'Low Match';
  }

  getScoreClass(): string {
    if (this.atsScore >= 80) {
      return 'excellent';
    }

    if (this.atsScore >= 65) {
      return 'good';
    }

    if (this.atsScore >= 45) {
      return 'average';
    }

    return 'poor';
  }

  clearAnalysis(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.jobDescription = '';
    this.resumeText = '';
    this.errorMessage = '';
    this.resetResults();
  }

  private resetResults(): void {
    this.showResults = false;
    this.atsScore = 0;
    this.matchedKeywords = [];
    this.missingKeywords = [];
    this.suggestions = [];
    this.resumeWordCount = 0;
    this.jobDescriptionWordCount = 0;
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/c\+\+/g, 'cplusplus')
      .replace(/c#/g, 'csharp')
      .replace(/node\.js/g, 'nodejs')
      .replace(/express\.js/g, 'expressjs')
      .replace(/[^a-z0-9+#.\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private getWords(text: string): string[] {
    return text
      .split(/\s+/)
      .map(word => word.trim())
      .filter(Boolean);
  }

  private getFileExtension(fileName: string): string {
    return fileName
      .split('.')
      .pop()
      ?.toLowerCase() || '';
  }
}