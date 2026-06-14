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

const getEducations = async () => {

  const profile =
    await getProfileByUserId();

  return await prisma.education.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

};

const addEducation = async (data) => {

  const profile =
    await getProfileByUserId();

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

const deleteEducation = async (id) => {

  return await prisma.education.delete({
    where: {
      id
    }
  });

};

module.exports = {
  getEducations,
  addEducation,
  deleteEducation
};