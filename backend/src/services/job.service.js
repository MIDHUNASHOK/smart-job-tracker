const prisma = require('../config/prisma');

const createJob = async (
  userId,
  jobData
) => {

  const newJob =
    await prisma.job.create({

      data: {

        userId,

        job_Title: jobData.job_Title,

        company_Name: jobData.company_Name,

        location: jobData.location,

        job_Type: jobData.job_Type,

        work_mode: jobData.work_mode,

        status: jobData.status,

        applied_Date: new Date(
          jobData.applied_Date
        ),

        job_Url: jobData.job_Url || null,

        notes: jobData.notes || null

      }

    });

  return newJob;

};

const getAllJobs = async (userId) => {

  const jobs =
    await prisma.job.findMany({

      where: {
        userId
      },

      orderBy: {
        createdAt: 'desc'
      }

    });

  return jobs;

};

const updateJob = async (
  userId,
  id,
  payload
) => {

  const updatedJob =
    await prisma.job.updateMany({

      where: {
        id,
        userId
      },

      data: {
        job_Title: payload.job_Title,
        company_Name: payload.company_Name,
        location: payload.location,
        job_Type: payload.job_Type,
        work_mode: payload.work_mode,
        status: payload.status,
        applied_Date: payload.applied_Date
          ? new Date(payload.applied_Date)
          : undefined,
        job_Url: payload.job_Url || null,
        notes: payload.notes || null
      }

    });

  return updatedJob;

};

const deleteJob = async (
  userId,
  id
) => {

  const deletedJob =
    await prisma.job.deleteMany({

      where: {
        id,
        userId
      }

    });

  return deletedJob;

};

module.exports = {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob
};