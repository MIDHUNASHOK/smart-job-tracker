const { z } = require('zod');

const scoreSchema = z.number().int().min(0).max(100);

const smartApplyAnalysisSchema = z.object({
  scores: z.object({
    overall: scoreSchema,
    skills: scoreSchema,
    experience: scoreSchema,
    location: scoreSchema,
    workPreference: scoreSchema
  }),

  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  strongExperienceEvidence: z.array(z.string()),
  cvImprovements: z.array(z.string()),
  recommendedSummary: z.string(),
  interviewSuggestions: z.array(z.string())
});

module.exports = {
  smartApplyAnalysisSchema
};