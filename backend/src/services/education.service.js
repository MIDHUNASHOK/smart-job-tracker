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

const getEducations = async (userId) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.education.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

};

const addEducation = async (
  userId,
  data
) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.education.create({
    data: {
      profileId: profile.id,
      degree: data.degree,
      institute: data.institute,
      startYear: data.startYear,
      endYear: data.endYear
    }
  });

};

const deleteEducation = async (
  userId,
  id
) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.education.deleteMany({
    where: {
      id,
      profileId: profile.id
    }
  });

};

module.exports = {
  getEducations,
  addEducation,
  deleteEducation
};