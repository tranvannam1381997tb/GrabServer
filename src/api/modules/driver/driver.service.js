const Driver = require("./driver.model");
const admin = require("firebase-admin");

/**
 * create driver
 *
 * @param {*} req
 * @param {*} res
 */
exports.create = async (req, res) => {
  const driverInfo = req.body;
  const isExistPhoneNumber = await Driver.exists({
    phoneNumber: driverInfo.phoneNumber,
  });
  if (isExistPhoneNumber) {
    res.status(400).send({ error: "Phone number already exists." });
    return;
  }
  let driverNew = new Driver();
  driverNew.password = driverInfo.password;
  driverNew.name = driverInfo.name;
  driverNew.age = driverInfo.age;
  driverNew.sex = driverInfo.sex;
  driverNew.phoneNumber = driverInfo.phoneNumber;
  driverNew.licensePlateNumber = driverInfo.licensePlateNumber;
  driverNew.typeVehicle = driverInfo.typeVehicle;
  driverNew.typeDriver = driverInfo.typeDriver;
  driverNew.startDate = driverInfo.startDate;
  const driverSaved = await driverNew.save();
  let driverRef = admin.database().ref(`drivers/${driverSaved._id}`);
  driverRef.set({
    rate: 5,
    longitude: 0,
    latitude: 0,
    status: 0,
    tokenId: "",
  });
  res.send({ success: "Create successfully.", driverId: driverSaved._id });
  res.end();
};

/**
 * login
 *
 * @param {*} req
 * @param {*} res
 */
exports.login = async (req, res) => {
  const driverInfo = req.body;
  const isExistPhoneNumber = await Driver.exists({
    phoneNumber: driverInfo.phoneNumber,
  });
  if (!isExistPhoneNumber) {
    res.status(400).end();
    return;
  }
  Driver.findOne({
    phoneNumber: driverInfo.phoneNumber,
    password: driverInfo.password,
  }).then((driver) => {
    if (!driver) {
      res.status(400).end();
      return;
    }
    res.send({
      success: "Login successfully.",
      driver: driver,
    });
    res.end();
  });
};
