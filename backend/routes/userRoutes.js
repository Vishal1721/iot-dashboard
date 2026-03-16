const express = require("express");
const registerUser = require("../controllers/user/registerUser");
const loginUser = require("../controllers/user/loginUser");
const getUser = require("../controllers/user/getUser");
const updateUser = require("../controllers/user/updateUser");
const deleteUser = require("../controllers/user/deleteUser");
const authenticateToken = require("../middleware/authenticateToken");
const getAllUsers = require("../controllers/user/getAllUsers");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const router = express.Router();

// Define user-related routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/profile", authenticateToken, getUser);
router.patch("/users/profile", authenticateToken, updateUser);
router.delete("/users/profile", authenticateToken, deleteUser);
router.get("/users", authenticateToken, getAllUsers);

module.exports = router;
