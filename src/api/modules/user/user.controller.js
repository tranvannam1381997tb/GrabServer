const userService = require("./user.service");

exports.create = (req, res) => userService.create(req, res);
exports.login = (req, res) => userService.login(req, res);
exports.findDrivers = (req, res) => userService.findDrivers(req, res);
exports.rating = (req, res) => userService.rating(req, res);
