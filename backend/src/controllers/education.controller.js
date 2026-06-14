const educationService =
  require('../services/education.service');

const getEducations = async (req, res) => {

  try {

    const educations =
      await educationService.getEducations();

    return res.status(200).json({
      success: true,
      data: educations
    });

  } catch (error) {

    console.log('GET EDUCATION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch educations'
    });

  }

};

const addEducation = async (req, res) => {

  try {

    const {
      degree,
      institute
    } = req.body;

    if (!degree || !institute) {

      return res.status(400).json({
        success: false,
        message: 'Degree and institute are required'
      });

    }

    const education =
      await educationService.addEducation(req.body);

    return res.status(201).json({
      success: true,
      message: 'Education added successfully',
      data: education
    });

  } catch (error) {

    console.log('ADD EDUCATION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to add education'
    });

  }

};

const deleteEducation = async (req, res) => {

  try {

    const { id } = req.params;

    await educationService.deleteEducation(id);

    return res.status(200).json({
      success: true,
      message: 'Education deleted successfully'
    });

  } catch (error) {

    console.log('DELETE EDUCATION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete education'
    });

  }

};

module.exports = {
  getEducations,
  addEducation,
  deleteEducation
};