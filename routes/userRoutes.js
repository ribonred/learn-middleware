const express = require("express");
const userController = require("../controllers/userController");
const permissions = require("../permission");

const router = express.Router();
router.post("/login", userController.login);
router.get("/profile", permissions.isAuthenticated, userController.profile);
module.exports = router;

