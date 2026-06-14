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

const getSkills = async () => {

  const profile =
    await getProfileByUserId();

  return await prisma.skill.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

};

const addSkill = async (skillName) => {

  const profile =
    await getProfileByUserId();

  return await prisma.skill.create({
    data: {
      name: skillName,
      profileId: profile.id
    }
  });

};

const deleteSkill = async (id) => {

  return await prisma.skill.delete({
    where: {
      id
    }
  });

};

module.exports = {
  getSkills,
  addSkill,
  deleteSkill
};