const prisma = require('../config/prisma');

const getProfile = async (userId) => {

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

const saveProfile = async (userId, profileData) => {

  return await prisma.profile.upsert({

    where: {
      userId
    },

    update: {
      fullName: profileData.fullName,
      phone: profileData.phone,
      location: profileData.location,
      linkedin: profileData.linkedin,
      github: profileData.github,
      summary: profileData.summary,
      avatarUrl: profileData.avatarUrl
    },

    create: {
      userId,
      fullName: profileData.fullName,
      phone: profileData.phone,
      location: profileData.location,
      linkedin: profileData.linkedin,
      github: profileData.github,
      summary: profileData.summary,
      avatarUrl: profileData.avatarUrl
    }

  });

};

module.exports = {
  getProfile,
  saveProfile
};