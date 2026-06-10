const profileService = require('../services/profile.service');

const getProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const profile =
      await profileService.getProfile(userId);

    return res.status(200).json({

      success: true,

      data: profile

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: 'Failed to fetch profile'

    });

  }

};

const saveProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const response =
      await profileService.saveProfile(
        userId,
        req.body
      );

    return res.status(200).json({

      success: true,

      message: 'Profile saved successfully',

      data: response

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: 'Failed to save profile'

    });

  }

};

module.exports = {
  getProfile,
  saveProfile
};