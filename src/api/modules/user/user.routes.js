const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

/**
 * create new user
 */
router.route("/create").post(userController.create);

/**
 * login for user
 */
router.route("/login").post(userController.login);

/**
 * find drivers
 */
router.route("/find-drivers").post(userController.findDrivers);

module.exports = router;
