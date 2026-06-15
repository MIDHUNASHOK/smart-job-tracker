const profileService = require('../services/profile.service');

const getProfile = async (req, res) => {

  try {

    console.log('REQ USER:', req.user);

    const userId = req.user.userId;

    if (!userId) {

      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });

    }

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

    console.log('REQ USER:', req.user);

    const userId = req.user.userId;

    if (!userId) {

      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });

    }

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