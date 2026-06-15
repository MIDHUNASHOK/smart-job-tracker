const prisma = require('../config/prisma');

const getProfileByUserId = async (userId) => {

  let profile = await prisma.profile.findUnique({
    where: {
      userId
    }
  });

  if (!profile) {

    profile = await prisma.profile.create({
      data: {
        userId
      }
    });

  }

  return profile;

};

const getExperiences = async (userId) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.experience.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

};

const addExperience = async (
  userId,
  data
) => {

  const profile =
    await getProfileByUserId(userId);

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

const deleteExperience = async (
  userId,
  id
) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.experience.deleteMany({
    where: {
      id,
      profileId: profile.id
    }
  });

};

module.exports = {
  getExperiences,
  addExperience,
  deleteExperience
};