const express = require("express");
const router = express.Router();

const driverController = require("./driver.controller");

/**
 * create new driver
 */
router.route("/create").post(driverController.create);

/**
 * login for driver
 */
router.route("/login").post(driverController.login);

module.exports = router;
