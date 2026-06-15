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

const getLanguages = async (userId) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.language.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

};

const addLanguage = async (
  userId,
  data
) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.language.create({
    data: {
      profileId: profile.id,
      name: data.name,
      level: data.level
    }
  });

};

const deleteLanguage = async (
  userId,
  id
) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.language.deleteMany({
    where: {
      id,
      profileId: profile.id
    }
  });

};

module.exports = {
  getLanguages,
  addLanguage,
  deleteLanguage
};