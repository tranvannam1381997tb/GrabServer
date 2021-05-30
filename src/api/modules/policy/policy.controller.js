const policyService = require("./policy.service");

exports.createPolicy = (req, res) => policyService.createPolicy(req, res);

exports.updatePolicy = (req, res) => policyService.updatePolicy(req, res);

exports.getPolicy = (req, res) => policyService.getPolicy(req, res);

