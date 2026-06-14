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

const getLanguages = async () => {

  const profile =
    await getProfileByUserId();

  return await prisma.language.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

};

const addLanguage = async (data) => {

  const profile =
    await getProfileByUserId();

  return await prisma.language.create({
    data: {
      profileId: profile.id,
      name: data.name,
      level: data.level
    }
  });

};

const deleteLanguage = async (id) => {

  return await prisma.language.delete({
    where: {
      id
    }
  });

};

module.exports = {
  getLanguages,
  addLanguage,
  deleteLanguage
};