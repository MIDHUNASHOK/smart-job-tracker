const certificationService =
  require('../services/certification.service');

const getCertifications = async (req, res) => {

  try {

    const certifications =
      await certificationService.getCertifications();

    return res.status(200).json({
      success: true,
      data: certifications
    });

  } catch (error) {

    console.log('GET CERTIFICATION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch certifications'
    });

  }

};

const addCertification = async (req, res) => {

  try {

    const { name } = req.body;

    if (!name) {

      return res.status(400).json({
        success: false,
        message: 'Certification name is required'
      });

    }

    const certification =
      await certificationService.addCertification(req.body);

    return res.status(201).json({
      success: true,
      message: 'Certification added successfully',
      data: certification
    });

  } catch (error) {

    console.log('ADD CERTIFICATION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to add certification'
    });

  }

};

const deleteCertification = async (req, res) => {

  try {

    const { id } = req.params;

    await certificationService.deleteCertification(id);

    return res.status(200).json({
      success: true,
      message: 'Certification deleted successfully'
    });

  } catch (error) {

    console.log('DELETE CERTIFICATION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete certification'
    });

  }

};

module.exports = {
  getCertifications,
  addCertification,
  deleteCertification
};