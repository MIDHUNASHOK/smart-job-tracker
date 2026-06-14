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

const getCertifications = async () => {

  const profile =
    await getProfileByUserId();

  return await prisma.certification.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

};

const addCertification = async (data) => {

  const profile =
    await getProfileByUserId();

  return await prisma.certification.create({
    data: {
      profileId: profile.id,
      name: data.name,
      issuer: data.issuer,
      year: data.year
    }
  });

};

const deleteCertification = async (id) => {

  return await prisma.certification.delete({
    where: {
      id
    }
  });

};

module.exports = {
  getCertifications,
  addCertification,
  deleteCertification
};