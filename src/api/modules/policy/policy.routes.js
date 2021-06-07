const express = require("express");
const router = express.Router();

const policyController = require("./policy.controller");

/**
 * create policy
 */
router.route("/create").put(policyController.createPolicy);

/**
 * update policy
 */
router.route("/update").post(policyController.updatePolicy);

/**
 * get policy
 */
router.route("/get").get(policyController.getPolicy);

module.exports = router; 