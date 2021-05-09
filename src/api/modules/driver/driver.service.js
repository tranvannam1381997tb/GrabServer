const Driver = require("./driver.model");
const admin = require("firebase-admin");
const Constants = require("../../../utils/constants");
var { DateTime } = require("luxon");

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
  driverNew.startDate = DateTime.now();
  driverNew.rate = 5;
  driverNew.status = Constants.STATUS_ON;
  const driverSaved = await driverNew.save();
  const driverRef = admin.database().ref(`drivers/${driverSaved._id}`);
  await driverRef.set({
    longitude: 0,
    latitude: 0,
    status: driverSaved.status,
    tokenId: "",
  });
  res.send({ success: true, driverId: driverSaved._id });
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
  }).then(async (driver) => {
    if (!driver) {
      res.status(400).end();
      return;
    }
    // update to firebase
    const driverRef = admin.database().ref(`drivers/${driver._id}`);
    await driverRef.update({
      status: Constants.STATUS_ON,
    });
    // update to mongodb
    await Driver.updateOne(
      { _id: driver._id },
      {
        status: Constants.STATUS_ON,
      }
    );
    res.send({
      success: true,
      driver: {
        driverId: driver._id,
        name: driver.name,
        age: driver.age,
        sex: driver.sex,
        phoneNumber: driver.phoneNumber,
        licensePlateNumber: driver.licensePlateNumber,
        typeVehicle: driver.typeVehicle,
        typeDriver: driver.typeDriver,
        startDate: driver.startDate,
        rate: driver.rate,
        status: Constants.STATUS_ON,
      },
    });
    res.end();
  });
};

/**
 * arriving
 *
 * @param {*} req
 * @param {*} res
 */
exports.arriving = async (req, res) => {
  const driverInfo = req.body;
  // update to firebase
  const driverRef = admin.database().ref(`drivers/${driverInfo.driverId}`);
  await driverRef.update({
    status: Constants.STATUS_ARRIVING_ORIGIN,
  });
  // update to mongodb
  await Driver.updateOne(
    { _id: driverInfo.driverId },
    {
      status: Constants.STATUS_ARRIVING_ORIGIN,
    }
  );
  res.send({ success: true });
  res.end();
};

/**
 * going
 * 
 * @param {*} req
 * @param {*} res
 */
exports.going = async (req, res) => {
  const driverInfo = req.body;
  // update to firebase
  const driverRef = admin.database().ref(`drivers/${driverInfo.driverId}`);
  await driverRef.update({
    status: Constants.STATUS_GOING,
  });
  // update to mongodb
  await Driver.updateOne(
    { _id: driverInfo.driverId },
    {
      status: Constants.STATUS_GOING,
    }
  );
  res.send({ success: true });
  res.end();
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.cancel = async (req, res) => {};
