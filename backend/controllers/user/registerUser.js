const bcrypt = require("bcrypt");
const Joi = require("joi");
const UserModel = require("../../models/userModel");
const { generateToken } = require("../../utils/jwtUtils");

const registerUser = async (req, res) => {

  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    registerNumber: Joi.string().required(),
    batch: Joi.number().integer().required(),
  });
  console.log("Register User Request Body:", req.body);
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
    const existingUser = await UserModel.findByEmailOrUsername(
      value.email,
      value.username,
    );

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email or username already exists",
      });
    }

   
    const hashedPassword = await bcrypt.hash(value.password, 10);

    const newUser = await UserModel.createUser({
      ...value,
      password: hashedPassword,
    });

    //  Generate JWT
    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
    });

    return res.status(201).json({
      status: "success",
      message: "User registered",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
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

module.exports = registerUser;
