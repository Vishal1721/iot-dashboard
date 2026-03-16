const projectModel = require("../../models/projectModel");
const joi = require("joi");

const deleteProject = async (req, res) => {
  const schema = joi.object({
    projectId: joi.string().hex().length(24).required(),
  });

  const { error, value } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
    const project = await projectModel.findProjectById(value.projectId);

    if (!project || project.owner.toString() !== req.user.id) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    await projectModel.deleteProject(value.projectId);

    return res.status(200).json({
      status: "success",
      message: "Project deleted",
    });
  } catch (err) {
    console.error(err); // always log backend errors
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = deleteProject;