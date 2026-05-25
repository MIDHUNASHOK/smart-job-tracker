const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createJob = async (jobData) => {

  const newJob = await prisma.job.create({

    data: {

      job_Title: jobData.job_Title,

      company_Name: jobData.company_Name,

      location: jobData.location,

      job_Type: jobData.job_Type,

      work_mode: jobData.work_mode,

      status: jobData.status,

      applied_Date: new Date(jobData.applied_Date),

      job_Url: jobData.job_Url || null,

      notes: jobData.notes || null

    }

  });

  return newJob;

};

const getAllJobs = async () => {

    const jobs = await prisma.job.findMany({
  
      orderBy: {
  
        createdAt: 'desc'
  
      }
  
    });
  
    return jobs;
  
  };

module.exports = {
  createJob,
  getAllJobs
};