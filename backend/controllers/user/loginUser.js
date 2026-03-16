const bcrypt = require("bcrypt");
const Joi = require("joi");
const UserModel = require("../../models/userModel"); // ✅ class model
const { generateToken } = require("../../utils/jwtUtils");

const loginUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  console.log("Login User Request Body:", req.body);
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
   console.log("Searching for:", value.email);
    const user = await UserModel.findByEmail(value.email);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(value.password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
    }
    // Generate JWT
    const token = generateToken({
      id: user._id,
      role: user.role,
    });
    console.log("Generated Token:", token);
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = loginUser;
