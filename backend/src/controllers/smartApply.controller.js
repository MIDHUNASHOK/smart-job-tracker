const {
  analyzeJobWithAI
} = require('../services/smartApply.service');

const analyzeJob = async (req, res) => {
  try {
    const {
      jobTitle,
      companyName,
      location,
      workPreference,
      jobDescription
    } = req.body;

    if (
      !jobTitle ||
      !companyName ||
      !jobDescription ||
      jobDescription.trim().length < 80
    ) {
      return res.status(400).json({
        message:
          'Job title, company and a complete job description are required.'
      });
    }

    /*
      Temporary candidate profile.

      Later, replace this with the authenticated user's
      profile retrieved from PostgreSQL.
    */
    const candidate = {
      name: 'Midhun Ashok',
      profession: 'Software Engineer',
      location: 'Berlin, Germany',
      education: [
        'Bachelor of Computer Applications',
        'Master of Computer Applications'
      ],
      skills: [
        'Angular',
        'TypeScript',
        'RxJS',
        'Bootstrap',
        'Node.js',
        'Express',
        'PostgreSQL',
        'Prisma',
        'REST APIs',
        'Git'
      ],
      experience: [
        {
          title: 'Application Developer',
          company: 'Data Devices Pvt Ltd',
          description:
            'Built and maintained Angular applications and worked with REST APIs.'
        },
        {
          project: 'The Hotelier',
          description:
            'Led Angular application development and collaborated with a development team.'
        }
      ],
      workPreferences: {
        locations: ['Berlin', 'Germany'],
        modes: ['ONSITE', 'HYBRID', 'REMOTE']
      }
    };

    const analysis = await analyzeJobWithAI({
      job: {
        jobTitle,
        companyName,
        location: location || '',
        workPreference: workPreference || '',
        jobDescription
      },
      candidate
    });

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Smart Apply analysis error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to analyze this job right now.'
    });
  }
};

module.exports = {
  analyzeJob
};