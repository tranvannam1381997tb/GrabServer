const express = require("express");
var router = express.Router();

// import driver routes
const driverRoutes = require("./modules/driver/driver.routes");
router.use("/driver", driverRoutes);

// import user routes
const userRoutes = require("./modules/user/user.routes");
router.use("/user", userRoutes);

const policyRoutes = require("./modules/policy/policy.routes");
router.use("/policy", policyRoutes);

module.exports = router;
