const profileService = require('../services/profile.service');

const TEMP_USER_ID = 1;

const getProfile = async (req, res) => {

  try {

    const userId = TEMP_USER_ID;

    const profile =
      await profileService.getProfile(userId);

    return res.status(200).json({

      success: true,

      data: profile

    });

  } catch (error) {

    console.log('PROFILE ERROR:', error);

    return res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

const saveProfile = async (req, res) => {

  try {

    const userId = TEMP_USER_ID;

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

    console.log('PROFILE SAVE ERROR:', error);

    return res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = {
  getProfile,
  saveProfile
};