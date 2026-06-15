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

const getSkills = async (userId) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.skill.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

};

const addSkill = async (
  userId,
  skillName
) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.skill.create({
    data: {
      name: skillName,
      profileId: profile.id
    }
  });

};

const deleteSkill = async (
  userId,
  id
) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.skill.deleteMany({
    where: {
      id,
      profileId: profile.id
    }
  });

};

module.exports = {
  getSkills,
  addSkill,
  deleteSkill
};