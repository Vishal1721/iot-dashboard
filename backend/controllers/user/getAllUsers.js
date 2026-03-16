const UserModel = require("../../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users for admin:", req.user.id);
    const users = await UserModel.getAllUsers();

    return res.status(200).json({
      status: "success",
      count: users.length,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = getAllUsers;
