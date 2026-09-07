const openai = require('../config/openai');
const { zodTextFormat } = require('openai/helpers/zod');
const {
  smartApplyAnalysisSchema
} = require('../schemas/smartApply.schema');

const analyzeJobWithAI = async ({ job, candidate }) => {
  const response = await openai.responses.parse({
    model: process.env.OPENAI_MODEL || 'gpt-5-mini',

    input: [
      {
        role: 'system',
        content: `
You are a truthful job-application assistant.

Compare the candidate profile with the job description.

Rules:
- Use only information supplied in the candidate profile.
- Never invent skills, qualifications or experience.
- Put unsupported requirements under missingSkills.
- Scores must be integers between 0 and 100.
- Missing keywords must be relevant to the job.
- Recommended summaries must remain truthful.
- Suggestions must be practical and specific.
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
    throw new Error('The AI did not return a valid analysis');
  }

  return response.output_parsed;
};

module.exports = {
  analyzeJobWithAI
};