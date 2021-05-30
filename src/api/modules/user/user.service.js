const User = require("./user.model");
const Driver = require("../driver/driver.model");
const axios = require("axios");
const Constants = require("../../../utils/constants");
const admin = require("firebase-admin");
const { async } = require("rxjs");

/**
 * create user
 *
 * @param {*} req
 * @param {*} res
 */
exports.create = async (req, res) => {
  const userInfo = req.body;
  const isExistPhoneNumber = await User.exists({
    phoneNumber: userInfo.phoneNumber,
  });
  if (isExistPhoneNumber) {
    res.status(400).send({ error: "Phone number already exists." });
    return;
  }
  let userNew = new User();
  userNew.password = userInfo.password;
  userNew.name = userInfo.name;
  userNew.age = userInfo.age;
  userNew.sex = userInfo.sex;
  userNew.phoneNumber = userInfo.phoneNumber;
  const userSaved = await userNew.save();
  let userRef = admin.database().ref(`users/${userSaved._id}`);
  userRef.set({
    longitude: 0,
    latitude: 0,
    status: 0,
    tokenId: "",
  });
  res.send({ success: true, userId: userSaved._id });
  res.end();
};

/**
 * login
 *
 * @param {*} req
 * @param {*} res
 */
exports.login = async (req, res) => {
  const userInfo = req.body;
  const isExistPhoneNumber = await User.exists({
    phoneNumber: userInfo.phoneNumber,
  });
  if (!isExistPhoneNumber) {
    res.status(400).end();
    return;
  }
  User.findOne({
    phoneNumber: userInfo.phoneNumber,
    password: userInfo.password,
  }).then((user) => {
    if (!user) {
      res.status(400).end();
      return;
    }
    res.send({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        age: user.age,
        sex: user.sex,
        phoneNumber: user.phoneNumber,
      },
    });
    res.end();
  });
};

/**
 * find drivers
 *
 * @param {*} req
 * @param {*} res
 */
exports.findDrivers = async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    res.send({ error: "Invalid payload." });
    return;
  }
  const firebase = admin.database();
  const refUser = firebase.ref(`users/${userId}`);
  refUser.once("value", async (userData) => {
    const user = userData.val();
    const drivers = await Driver.find({
      status: Constants.STATUS_ON,
    });
    if (drivers.length == 0) {
      res.send({ success: true, drivers: [] });
      res.end();
      return;
    }
    const driverIds = drivers.map((driver) => driver._id);
    Promise.all(
      driverIds.map((driverId) => {
        return firebase.ref("drivers/").child(`${driverId}`).once("value");
      })
    ).then(
      (snapshots) => {
        let firebaseDrivers = [];
        snapshots.forEach((driverData) => {
          let driver = driverData.val();
          firebaseDrivers.push({
            driverId: driverData.key,
            latitude: driver.latitude,
            longitude: driver.longitude,
            status: driver.status,
          });
        });
        if (firebaseDrivers.length == 0) {
          res.send({ success: true, drivers: [] });
          res.end();
          return;
        }
        const googleMapUrl = "https://maps.googleapis.com/maps";
        Promise.all(
          firebaseDrivers.map((firebaseDriver) => {
            return new Promise(async (resolve, reject) => {
              let destination = `${firebaseDriver.latitude},${firebaseDriver.longitude}`;
              const payload = {
                origin: `${user.latitude},${user.longitude}`,
                destination: destination,
                key: Constants.GOOGLE_MAP_API_KEY,
              };
              const map = await axios.get(
                `${googleMapUrl}/api/directions/json`,
                {
                  params: payload,
                }
              );
              if (map.data.status == "OK") {
                if (map.data.routes && map.data.routes.length > 0) {
                  firebaseDriver["distanceOrigin"] =
                    map.data.routes[0].legs[0].distance.value;
                }
              }
              resolve();
            });
          })
        ).then(() => {
          let drivers1km = firebaseDrivers.filter(
            (driver) =>
              driver["distanceOrigin"] && driver["distanceOrigin"] <= 1000
          );
          if (drivers1km.length >= Constants.DRIVER_LIST_SIZE) {
            drivers1km = drivers1km
              .sort(
                (driver1, driver2) =>
                  driver1["distanceOrigin"] - driver2["distanceOrigin"]
              )
              .splice(0, Constants.DRIVER_LIST_SIZE);
            const responseDrivers = drivers1km.map((driver1km) => {
              const driverResponse = drivers.find(
                (driver) => driver._id == driver1km.driverId
              );
              return {
                driverId: driverResponse._id,
                name: driverResponse.name,
                age: driverResponse.age,
                sex: driverResponse.sex,
                phoneNumber: driverResponse.phoneNumber,
                licensePlateNumber: driverResponse.licensePlateNumber,
                typeVehicle: driverResponse.typeVehicle,
                typeDriver: driverResponse.typeDriver,
                startDate: driverResponse.startDate,
                rate: driverResponse.rate,
                status: driverResponse.status,
                totalBook: driverResponse.totalBook,
                distance: driver1km["distanceOrigin"] / 1000,
              };
            });
            res.send({ success: true, drivers: responseDrivers });
            res.end();
          } else {
            let drivers2km = firebaseDrivers.filter(
              (driver) =>
                driver["distanceOrigin"] && driver["distanceOrigin"] <= 2000
            );
            if (drivers2km.length >= Constants.DRIVER_LIST_SIZE) {
              drivers2km = drivers2km
                .sort(
                  (driver1, driver2) =>
                    driver1["distanceOrigin"] - driver2["distanceOrigin"]
                )
                .splice(0, Constants.DRIVER_LIST_SIZE);
              const responseDrivers = drivers2km.map((driver2km) => {
                const driverResponse = drivers.find(
                  (driver) => driver._id == driver2km.driverId
                );
                return {
                  driverId: driverResponse._id,
                  name: driverResponse.name,
                  age: driverResponse.age,
                  sex: driverResponse.sex,
                  phoneNumber: driverResponse.phoneNumber,
                  licensePlateNumber: driverResponse.licensePlateNumber,
                  typeVehicle: driverResponse.typeVehicle,
                  typeDriver: driverResponse.typeDriver,
                  startDate: driverResponse.startDate,
                  rate: driverResponse.rate,
                  status: driverResponse.status,
                  totalBook: driverResponse.totalBook,
                  distance: driver2km["distanceOrigin"] / 1000,
                };
              });
              res.send({ success: true, drivers: responseDrivers });
              res.end();
            } else {
              let drivers5km = firebaseDrivers.filter(
                (driver) =>
                  driver["distanceOrigin"] && driver["distanceOrigin"] <= 5000
              );
              const responseDrivers = drivers5km.map((driver5km) => {
                const driverResponse = drivers.find(
                  (driver) => driver._id == driver5km.driverId
                );
                return {
                  driverId: driverResponse._id,
                  name: driverResponse.name,
                  age: driverResponse.age,
                  sex: driverResponse.sex,
                  phoneNumber: driverResponse.phoneNumber,
                  licensePlateNumber: driverResponse.licensePlateNumber,
                  typeVehicle: driverResponse.typeVehicle,
                  typeDriver: driverResponse.typeDriver,
                  startDate: driverResponse.startDate,
                  rate: driverResponse.rate,
                  status: driverResponse.status,
                  totalBook: driverResponse.totalBook,
                  distance: driver5km["distanceOrigin"] / 1000,
                };
              });
              console.log(responseDrivers);
              res.send({ success: true, drivers: responseDrivers });
              res.end();
            }
          }
        });
      },
      (error) => {
        console.log("The read failed: " + error.code);
      }
    );
  });
};

exports.rating = async (req, res) => {
  const driverId = req.body.driverId;
  const vote = req.body.vote;
  if (!vote || vote == 0) {
    res.end();
    return;
  }
  let driver = await Driver.findOne({
    _id: driverId,
  });
  const rateDriver =
    (driver.rate * driver.totalBook + vote) / (driver.totalBook + 1);
  await Driver.updateOne(
    { _id: driverId },
    {
      rate: rateDriver,
    }
  );
  res.send({ success: true });
  res.end();
};
