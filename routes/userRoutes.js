const express = require("express");
const userController = require("../controllers/userController");
const permissions = require("../permission");

const router = express.Router();
router.post("/login", userController.login);
router.post("/refreshtoken", userController.refreshToken);
router.get("/profile", permissions.isAuthenticated, userController.profile);
router.get("/admin", permissions.isAdmin, userController.adminProfile);
module.exports = router;

