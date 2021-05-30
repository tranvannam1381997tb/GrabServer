const driverService = require("./driver.service");

exports.create = (req, res) => driverService.create(req, res);

exports.login = (req, res) => driverService.login(req, res);

exports.arrivingOrigin = (req, res) => driverService.arrivingOrigin(req, res);

exports.arrivedOrigin = (req, res) => driverService.arrivedOrigin(req, res);

exports.arrivingDestination = (req, res) =>
  driverService.arrivingDestination(req, res);

exports.arrivedDestination = (req, res) =>
  driverService.arrivedDestination(req, res);

exports.billing = (req, res) => driverService.billing(req, res);

exports.cancel = (req, res) => driverService.cancel(req, res);

exports.updateStatus = (req, res) => driverService.updateStatus(req, res);

exports.logout = (req, res) => driverService.logout(req, res);
