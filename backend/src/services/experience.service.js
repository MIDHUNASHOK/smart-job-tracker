const prisma = require('../config/prisma');

const TEMP_USER_ID = 1;

const getProfileByUserId = async () => {

  let profile = await prisma.profile.findUnique({
    where: {
      userId: TEMP_USER_ID
    }
  });

  if (!profile) {

    profile = await prisma.profile.create({
      data: {
        userId: TEMP_USER_ID
      }
    });

  }

  return profile;

};

const getExperiences = async () => {

  const profile = await getProfileByUserId();

  return await prisma.experience.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

};

const addExperience = async (data) => {

  const profile = await getProfileByUserId();

  return await prisma.experience.create({
    data: {
      profileId: profile.id,
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description
    }
  });

};

const deleteExperience = async (id) => {

  return await prisma.experience.delete({
    where: {
      id
    }
  });

};

module.exports = {
  getExperiences,
  addExperience,
  deleteExperience
};