const driverService = require("./driver.service");

exports.create = (req, res) => driverService.create(req, res);
exports.login = (req, res) => driverService.login(req, res);
exports.arriving = (req, res) => driverService.arriving(req, res);
exports.going = (req, res) => driverService.going(req, res);
exports.cancel = (req, res) => driverService.cancel(req, res);
exports.updateStatus = (req, res) => driverService.updateStatus(req, res);
exports.logout = (req, res) => driverService.logout(req, res);


