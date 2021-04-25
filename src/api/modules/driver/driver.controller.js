const driverService = require("./driver.service");

exports.create = (req, res) => driverService.create(req, res);
exports.login = (req, res) => driverService.login(req, res);
