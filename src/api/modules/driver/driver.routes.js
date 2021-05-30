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
 * arriving origin
 */
router.route("/arriving-origin").post(driverController.arrivingOrigin);

/**
 * arrived origin
 */
router.route("/arrived-origin").post(driverController.arrivedOrigin);

/**
 * arriving destination
 */
router
  .route("/arriving-destination")
  .post(driverController.arrivingDestination);

/**
 * arrived destination
 */
router.route("/arrived-destination").post(driverController.arrivedDestination);

/**
 * arrived destination
 */
 router.route("/billing").post(driverController.billing);

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
