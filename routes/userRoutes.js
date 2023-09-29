const express = require("express");
const userController = require("../controllers/userController");
const permissions = require("../permission");

const router = express.Router();
router.post("/login", userController.login);
router.post("/login-session", userController.login_session);
router.post("/logout-session", userController.logout_session);
router.post("/refreshtoken", userController.refreshToken);
router.post("/register", userController.register);
router.get("/profile", permissions.isAuthenticated, userController.profile);
router.get("/admin", permissions.isAdmin, userController.adminProfile);
router.post("/forgot", userController.passwordResetRequest);
router.post("/reset", userController.passwordReset);
module.exports = router;

