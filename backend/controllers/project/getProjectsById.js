const ProjectModel = require("../../models/projectModel");
const Joi = require("joi");
const getProjectById = async (req, res) => {
  const schema = Joi.object({
    projectId: Joi.string().hex().length(24).required(),
  });
  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message
    });
  }
  try {
    const projectId = req.params.projectId;
    const project = await ProjectModel.findProjectById(projectId);
    console.log("project →", project);
    if (!project || project.owner.toString() !== req.user.id) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    return res.status(200).json({
      status: "success",
      project,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = getProjectById;
