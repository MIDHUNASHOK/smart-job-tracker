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

const saveProfile = async (
  userId,
  profileData
) => {

  const data = {

    fullName: profileData.fullName,
    profession: profileData.profession,
    email: profileData.email,
    phone: profileData.phone,
    location: profileData.location,
    linkedin: profileData.linkedin,
    github: profileData.github,
    summary: profileData.summary,
    avatarUrl: profileData.avatarUrl

  };

  return await prisma.profile.upsert({

    where: {
      userId
    },

    update: data,

    create: {
      userId,
      ...data
    }

  });

};

module.exports = {
  getProfile,
  saveProfile
};