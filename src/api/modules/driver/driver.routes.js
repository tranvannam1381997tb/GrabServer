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

/**
 * login for driver
 */
router.route("/arriving").post(driverController.arriving);

/**
 * login for driver
 */
router.route("/going").post(driverController.going);

/**
 * login for driver
 */
router.route("/cancel").post(driverController.cancel);

/**
 * update status for driver
 */
router.route("/update-status").post(driverController.updateStatus);

/**
 * update status for driver
 */
router.route("/logout").post(driverController.logout);

module.exports = router;
