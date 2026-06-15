const skillService = require('../services/skill.service');

const getSkills = async (req, res) => {

  try {

    const userId = req.user.userId;

    const skills =
      await skillService.getSkills(userId);

    return res.status(200).json({
      success: true,
      data: skills
    });

  } catch (error) {

    console.log('GET SKILLS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    });

  }

};

const addSkill = async (req, res) => {

  try {

    const userId = req.user.userId;

    const { name } = req.body;

    if (!name) {

      return res.status(400).json({
        success: false,
        message: 'Skill name is required'
      });

    }

    const skill =
      await skillService.addSkill(userId, name);

    return res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      data: skill
    });

  } catch (error) {

    console.log('ADD SKILL ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to add skill'
    });

  }

};

const deleteSkill = async (req, res) => {

  try {

    const userId = req.user.userId;

    const { id } = req.params;

    await skillService.deleteSkill(
      userId,
      id
    );

    return res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });

  } catch (error) {

    console.log('DELETE SKILL ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete skill'
    });

  }

};

module.exports = {
  getSkills,
  addSkill,
  deleteSkill
};