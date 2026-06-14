const experienceService =
  require('../services/experience.service');

const getExperiences = async (req, res) => {

  try {

    const experiences =
      await experienceService.getExperiences();

    return res.status(200).json({
      success: true,
      data: experiences
    });

  } catch (error) {

    console.log('GET EXPERIENCE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences'
    });

  }

};

const addExperience = async (req, res) => {

  try {

    const {
      jobTitle,
      companyName,
      startDate
    } = req.body;

    if (!jobTitle || !companyName || !startDate) {

      return res.status(400).json({
        success: false,
        message: 'Job title, company name and start date are required'
      });

    }

    const experience =
      await experienceService.addExperience(req.body);

    return res.status(201).json({
      success: true,
      message: 'Experience added successfully',
      data: experience
    });

  } catch (error) {

    console.log('ADD EXPERIENCE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to add experience'
    });

  }

};

const deleteExperience = async (req, res) => {

  try {

    const { id } = req.params;

    await experienceService.deleteExperience(id);

    return res.status(200).json({
      success: true,
      message: 'Experience deleted successfully'
    });

  } catch (error) {

    console.log('DELETE EXPERIENCE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete experience'
    });

  }

};

module.exports = {
  getExperiences,
  addExperience,
  deleteExperience
};