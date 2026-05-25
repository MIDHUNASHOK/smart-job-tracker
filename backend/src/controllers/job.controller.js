const jobService = require('../services/job.service');

const createJob = async (req, res) => {

  try {

    const jobData = req.body;

    const response = await jobService.createJob(jobData);

    return res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: response
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });

  }

};
const getAllJobs = async (req, res) => {

    try {
  
      const jobs = await jobService.getAllJobs();
  
      return res.status(200).json({
  
        success: true,
  
        data: jobs
  
      });
  
    } catch (error) {
  
      console.log(error);
  
      return res.status(500).json({
  
        success: false
  
      });
  
    }
  
  };

module.exports = {
  createJob,
  getAllJobs
};