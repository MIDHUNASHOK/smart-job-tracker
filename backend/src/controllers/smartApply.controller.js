const {
  analyzeJobWithAI
} = require('../services/smartApply.service');

const {
  getProfileForSmartApply
} = require('../services/profile.service');

const analyzeJob = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);

    if (!Number.isInteger(userId)) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in authentication token.'
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

    const profile = await getProfileForSmartApply(userId);

    if (!profile) {
      return res.status(400).json({
        success: false,
        message:
          'Please create your profile before using Smart Apply.'
      });
    }

    const hasCandidateInformation =
      Boolean(profile.summary?.trim()) ||
      profile.skills.length > 0 ||
      profile.experiences.length > 0 ||
      profile.educations.length > 0;

    if (!hasCandidateInformation) {
      return res.status(400).json({
        success: false,
        message:
          'Please add your skills, experience, education or professional summary before using Smart Apply.'
      });
    }

    /*
      Only career-related profile information is sent for analysis.
      Phone number, password and avatar are not sent to the AI.
    */
    const candidate = {
      fullName:
        profile.fullName ||
        profile.user.fullName,

      profession:
        profile.profession || '',

      location:
        profile.location || '',

      summary:
        profile.summary || '',

      skills: profile.skills.map(skill => ({
        name: skill.name
      })),

      experiences: profile.experiences.map(experience => ({
        jobTitle: experience.jobTitle,
        companyName: experience.companyName,
        startDate: experience.startDate,
        endDate: experience.endDate || 'Present',
        description: experience.description || ''
      })),

      educations: profile.educations.map(education => ({
        degree: education.degree,
        institute: education.institute,
        startYear: education.startYear || '',
        endYear: education.endYear || ''
      })),

      certifications: profile.certifications.map(
        certification => ({
          name: certification.name,
          issuer: certification.issuer || '',
          year: certification.year || ''
        })
      ),

      languages: profile.languages.map(language => ({
        name: language.name,
        level: language.level
      }))
    };

    const job = {
      jobTitle: jobTitle.trim(),
      companyName: companyName.trim(),
      location:
        typeof location === 'string'
          ? location.trim()
          : '',
      workPreference:
        typeof workPreference === 'string'
          ? workPreference.trim()
          : '',
      jobDescription: jobDescription.trim()
    };

    const analysis = await analyzeJobWithAI({
      job,
      candidate
    });

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Smart Apply analysis error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      requestId:
        error.request_id ||
        error.requestID
    });

    if (
      error.status === 429 ||
      error.code === 'credit_balance_exhausted'
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

module.exports = {
  analyzeJob
};