const languageService =
  require('../services/language.service');

const getLanguages = async (req, res) => {

  try {

    const userId = req.user.userId;

    const languages =
      await languageService.getLanguages(userId);

    return res.status(200).json({
      success: true,
      data: languages
    });

  } catch (error) {

    console.log('GET LANGUAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch languages'
    });

  }

};

const addLanguage = async (req, res) => {

  try {

    const userId = req.user.userId;

    const {
      name,
      level
    } = req.body;

    if (!name || !level) {

      return res.status(400).json({
        success: false,
        message: 'Language name and level are required'
      });

    }

    const language =
      await languageService.addLanguage(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message: 'Language added successfully',
      data: language
    });

  } catch (error) {

    console.log('ADD LANGUAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to add language'
    });

  }

};

const deleteLanguage = async (req, res) => {

  try {

    const userId = req.user.userId;

    const { id } = req.params;

    await languageService.deleteLanguage(
      userId,
      id
    );

    return res.status(200).json({
      success: true,
      message: 'Language deleted successfully'
    });

  } catch (error) {

    console.log('DELETE LANGUAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete language'
    });

  }

};

module.exports = {
  getLanguages,
  addLanguage,
  deleteLanguage
};