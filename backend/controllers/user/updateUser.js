const Joi = require("joi");
const UserModel = require("../../models/userModel");

const updateUser = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    batch: Joi.number().integer().optional(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
    // Update logged-in user
    const updatedUser = await UserModel.updateUser(req.user.id, value);

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = updateUser;