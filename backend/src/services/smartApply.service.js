const openai = require('../config/openai');

const {
  zodTextFormat
} = require('openai/helpers/zod');

const {
  smartApplyAnalysisSchema,
  smartApplyDocumentsSchema
} = require('../schemas/smartApply.schema');

const analyzeJobWithAI = async ({
  job,
  candidate
}) => {
  const response = await openai.responses.parse({
    model:
      process.env.OPENAI_MODEL ||
      'gpt-5-mini',

    input: [
      {
        role: 'system',
        content: `
You are a truthful job-application analysis assistant.

Compare the candidate profile with the job description.

Rules:
- Use only information supplied in the candidate profile.
- Never invent skills, experience or qualifications.
- Put unsupported requirements under missingSkills.
- Scores must be integers between 0 and 100.
- Missing keywords must be relevant to the job.
- The recommended summary must remain truthful.
- Suggestions must be specific and practical.
        `.trim()
      },
      {
        role: 'user',
        content: JSON.stringify({
          job,
          candidate
        })
      }
    ],

    text: {
      format: zodTextFormat(
        smartApplyAnalysisSchema,
        'smart_apply_analysis'
      )
    }
  });

  if (!response.output_parsed) {
    throw new Error(
      'The AI did not return a valid analysis.'
    );
  }

  return response.output_parsed;
};

const generateApplicationWithAI = async ({
  job,
  candidate,
  analysis,
  tailoredSummary
}) => {
  const response = await openai.responses.parse({
    model:
      process.env.OPENAI_MODEL ||
      'gpt-5-mini',

    input: [
      {
        role: 'system',
        content: `
You are a professional and truthful job-application writer.

Create application documents using only the supplied candidate profile,
job information and approved analysis.

Rules:
- Never invent experience, skills, qualifications or achievements.
- Do not claim that the candidate knows a missing skill.
- Do not copy sentences directly from the job description.
- Keep the writing professional, natural and specific.
- The tailored CV must be plain text with clear section headings.
- The tailored CV must prioritize relevant existing experience and skills.
- The cover letter should be concise and approximately 250 to 350 words.
- The application email should be approximately 80 to 140 words.
- Do not include placeholder text.
- Do not include markdown code fences.
- Use the candidate's real name where appropriate.
        `.trim()
      },
      {
        role: 'user',
        content: JSON.stringify({
          job,
          candidate,
          analysis,
          tailoredSummary
        })
      }
    ],

    text: {
      format: zodTextFormat(
        smartApplyDocumentsSchema,
        'smart_apply_documents'
      )
    }
  });

  if (!response.output_parsed) {
    throw new Error(
      'The AI did not return valid application documents.'
    );
  }

  return response.output_parsed;
};

module.exports = {
  analyzeJobWithAI,
  generateApplicationWithAI
};