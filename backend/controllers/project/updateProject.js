const Joi = require("joi");
const ProjectModel = require("../../models/projectModel");

const updateProject = async (req, res) => {
  const schema = Joi.object({
    projectName: Joi.string().optional(),
    description: Joi.string().optional(),
    MicroController: Joi.string().optional(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
    const { projectId } = req.params;

    const project = await ProjectModel.findProjectById(projectId);

    if (!project || project.owner.toString() !== req.user.id) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    const updatedProject = await ProjectModel.updateProject(projectId, value);

    return res.status(200).json({
      status: "success",
      message: "Project updated",
      project: updatedProject,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = updateProject;
