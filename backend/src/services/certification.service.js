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

const getCertifications = async (userId) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.certification.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

};

const addCertification = async (
  userId,
  data
) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.certification.create({
    data: {
      profileId: profile.id,
      name: data.name,
      issuer: data.issuer,
      year: data.year
    }
  });

};

const deleteCertification = async (
  userId,
  id
) => {

  const profile =
    await getProfileByUserId(userId);

  return await prisma.certification.deleteMany({
    where: {
      id,
      profileId: profile.id
    }
  });

};

module.exports = {
  getCertifications,
  addCertification,
  deleteCertification
};