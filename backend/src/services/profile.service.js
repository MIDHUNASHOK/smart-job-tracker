const prisma = require('../config/prisma');

const getProfile = async (userId) => {

  return await prisma.profile.findUnique({
    where: {
      userId
    }
  });

};

const saveProfile = async (userId, profileData) => {

  return await prisma.profile.upsert({

    where: {
      userId
    },

    update: {
      ...profileData
    },

    create: {
      userId,
      ...profileData
    }

  });

};

module.exports = {
  getProfile,
  saveProfile
};