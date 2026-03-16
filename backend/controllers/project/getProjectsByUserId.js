const ProjectModel = require("../../models/projectModel");
const Joi = require("joi");

const getProjectsByUserId = async (req, res) => {
  console.log("getProjectsByUserId API HIT");

  const schema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
  });

  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
    const paramUserId = req.params.userId;
    const tokenUserId = req.user?.id || req.user?._id;

    if (paramUserId !== tokenUserId) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized access",
      });
    }

    const projects = await ProjectModel.findByUserId(tokenUserId);

    return res.status(200).json({
      status: "success",
      count: projects.length,
      projects,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = getProjectsByUserId;
