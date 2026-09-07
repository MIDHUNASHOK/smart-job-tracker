const {
  analyzeJobWithAI,
  generateApplicationWithAI
} = require('../services/smartApply.service');

const {
  getProfileForSmartApply
} = require('../services/profile.service');

const {
  smartApplyAnalysisSchema
} = require('../schemas/smartApply.schema');

/*
  Converts the Prisma profile result into a clean object
  that can safely be sent to the AI service.
*/
const buildCandidate = profile => ({
  fullName:
    profile.fullName ||
    profile.user?.fullName ||
    '',

  profession:
    profile.profession || '',

  location:
    profile.location || '',

  summary:
    profile.summary || '',

  skills: profile.skills.map(skill => ({
    name: skill.name
  })),

  experiences: profile.experiences.map(
    experience => ({
      jobTitle: experience.jobTitle,
      companyName: experience.companyName,
      startDate: experience.startDate,
      endDate:
        experience.endDate || 'Present',
      description:
        experience.description || ''
    })
  ),

  educations: profile.educations.map(
    education => ({
      degree: education.degree,
      institute: education.institute,
      startYear:
        education.startYear || '',
      endYear:
        education.endYear || ''
    })
  ),

  certifications: profile.certifications.map(
    certification => ({
      name: certification.name,
      issuer:
        certification.issuer || '',
      year:
        certification.year || ''
    })
  ),

  languages: profile.languages.map(
    language => ({
      name: language.name,
      level: language.level
    })
  )
});

/*
  Checks whether the profile contains enough information
  to produce a meaningful AI analysis.
*/
const hasProfileInformation = profile => {
  return (
    Boolean(profile.summary?.trim()) ||
    profile.skills.length > 0 ||
    profile.experiences.length > 0 ||
    profile.educations.length > 0
  );
};

/*
  POST /api/smart-apply/analyze
*/
const analyzeJob = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(401).json({
        success: false,
        message:
          'User ID not found in authentication token.'
      });
    }

    const {
      jobTitle,
      companyName,
      location,
      workPreference,
      jobDescription
    } = req.body;

    if (
      typeof jobTitle !== 'string' ||
      !jobTitle.trim() ||
      typeof companyName !== 'string' ||
      !companyName.trim() ||
      typeof jobDescription !== 'string' ||
      jobDescription.trim().length < 80
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Job title, company and a complete job description are required.'
      });
    }

    const profile =
      await getProfileForSmartApply(userId);

    if (!profile) {
      return res.status(400).json({
        success: false,
        message:
          'Please create your profile before using Smart Apply.'
      });
    }

    if (!hasProfileInformation(profile)) {
      return res.status(400).json({
        success: false,
        message:
          'Please add your skills, experience, education or professional summary before using Smart Apply.'
      });
    }

    const candidate =
      buildCandidate(profile);

    const job = {
      jobTitle:
        jobTitle.trim(),

      companyName:
        companyName.trim(),

      location:
        typeof location === 'string'
          ? location.trim()
          : '',

      workPreference:
        typeof workPreference === 'string'
          ? workPreference.trim()
          : '',

      jobDescription:
        jobDescription.trim()
    };

    const analysis =
      await analyzeJobWithAI({
        job,
        candidate
      });

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error(
      'Smart Apply analysis error:',
      {
        message: error.message,
        status: error.status,
        code: error.code,
        requestId:
          error.request_id ||
          error.requestID
      }
    );

    if (
      error.status === 429 ||
      error.code ===
        'credit_balance_exhausted'
    ) {
      return res.status(503).json({
        success: false,
        message:
          'The AI service is temporarily unavailable because its usage limit has been reached.'
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Unable to analyze this job right now.'
    });
  }
};

/*
  POST /api/smart-apply/generate
*/
const generateApplication = async (
  req,
  res
) => {
  try {
    const userId = Number(req.user?.userId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(401).json({
        success: false,
        message:
          'User ID not found in authentication token.'
      });
    }

    const {
      job,
      analysis,
      tailoredSummary
    } = req.body;

    if (
      !job ||
      typeof job.jobTitle !== 'string' ||
      !job.jobTitle.trim() ||
      typeof job.companyName !== 'string' ||
      !job.companyName.trim() ||
      typeof job.jobDescription !== 'string' ||
      job.jobDescription.trim().length < 80
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Complete job information is required.'
      });
    }

    const analysisResult =
      smartApplyAnalysisSchema.safeParse(
        analysis
      );

    if (!analysisResult.success) {
      return res.status(400).json({
        success: false,
        message:
          'A valid job analysis is required before generating documents.'
      });
    }

    const profile =
      await getProfileForSmartApply(userId);

    if (!profile) {
      return res.status(400).json({
        success: false,
        message:
          'Please create your profile before generating an application.'
      });
    }

    if (!hasProfileInformation(profile)) {
      return res.status(400).json({
        success: false,
        message:
          'Please complete your profile before generating an application.'
      });
    }

    const candidate =
      buildCandidate(profile);

    const cleanedJob = {
      jobTitle:
        job.jobTitle.trim(),

      companyName:
        job.companyName.trim(),

      location:
        typeof job.location === 'string'
          ? job.location.trim()
          : '',

      workPreference:
        typeof job.workPreference === 'string'
          ? job.workPreference.trim()
          : '',

      jobDescription:
        job.jobDescription.trim()
    };

    const approvedSummary =
      typeof tailoredSummary === 'string' &&
      tailoredSummary.trim()
        ? tailoredSummary.trim()
        : analysisResult.data
            .recommendedSummary;

    const documents =
      await generateApplicationWithAI({
        job: cleanedJob,
        candidate,
        analysis: analysisResult.data,
        tailoredSummary: approvedSummary
      });

    return res.status(200).json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error(
      'Smart Apply generation error:',
      {
        message: error.message,
        status: error.status,
        code: error.code,
        requestId:
          error.request_id ||
          error.requestID
      }
    );

    if (
      error.status === 429 ||
      error.code ===
        'credit_balance_exhausted'
    ) {
      return res.status(503).json({
        success: false,
        message:
          'The AI service is temporarily unavailable because its usage limit has been reached.'
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Unable to generate the application right now.'
    });
  }
};

module.exports = {
  analyzeJob,
  generateApplication
};