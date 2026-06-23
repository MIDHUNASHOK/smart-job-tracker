const jobService = require('../services/job.service');

const createJob = async (req, res) => {

  try {

    const userId = req.user.userId;

    const jobData = req.body;

    const response =
      await jobService.createJob(
        userId,
        jobData
      );

    return res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: response
    });

  } catch (error) {

    console.log('CREATE JOB ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });

  }

};

const getAllJobs = async (req, res) => {

  try {

    const userId = req.user.userId;

    const jobs =
      await jobService.getAllJobs(userId);

    return res.status(200).json({
      success: true,
      data: jobs
    });

  } catch (error) {

    console.log('GET JOBS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });

  }

};

const updateJob = async (req, res) => {

  try {

    const userId = req.user.userId;

    const { id } = req.params;

    const response =
      await jobService.updateJob(
        userId,
        id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: response
    });

  } catch (error) {

    console.log('UPDATE JOB ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update job'
    });

  }

};

const deleteJob = async (req, res) => {

  try {

    const userId = req.user.userId;

    const { id } = req.params;

    await jobService.deleteJob(
      userId,
      id
    );

    return res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {

    console.log('DELETE JOB ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete job'
    });

  }

};

const checkJobSaved = async (req, res) => {

  try {

    const userId = req.user.userId;
    const { jobUrl } = req.query;

    if (!jobUrl) {
      return res.status(400).json({
        success: false,
        message: 'Job URL is required'
      });
    }

    const job =
      await jobService.checkJobSaved(
        userId,
        jobUrl
      );

    return res.status(200).json({
      success: true,
      saved: !!job,
      data: job
    });

  } catch (error) {

    console.log('CHECK JOB ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to check job'
    });

  }

};

module.exports = {
  createJob,
  getAllJobs,
  deleteJob,
  updateJob,
  checkJobSaved
};