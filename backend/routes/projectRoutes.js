const express = require("express");
const autenticateToken = require("../middleware/authenticateToken");
const createProject = require("../controllers/project/createProject.js");
const getProjectById = require("../controllers/project/getProjectsById.js");
const getProjectByUserId = require("../controllers/project/getProjectsByUserId.js");
const updateProject = require("../controllers/project/updateProject.js");
const deleteProject = require("../controllers/project/deleteProject.js");
const getAllProjects = require("../controllers/project/getAllProjects.js");
const authorizeAdmin = require("../middleware/authorizeAdmin.js");
const router = express.Router();

router.post("/projects", autenticateToken, createProject);
router.get("/projects/get/:projectId", autenticateToken, getProjectById);
router.get("/projects/all", autenticateToken, getAllProjects);
router.get("/projects/getByUser/:userId", autenticateToken, getProjectByUserId);
router.patch("/projects/update/:projectId", autenticateToken, updateProject);
router.delete("/projects/delete/:projectId", autenticateToken, deleteProject);


module.exports = router;