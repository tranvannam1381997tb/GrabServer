const User = require("./user.model");
const Driver = require("../driver/driver.model");
const axios = require("axios");
const Constants = require("../../../utils/constants");
const admin = require("firebase-admin");
const { isValidObjectId } = require("mongoose");

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
  const db = admin.database();
  let refUser = db.ref(`users/${userId}`);
  await refUser.once("value", async (userData) => {
    let drivers = [];
    const user = userData.val();
    let refDriver = db.ref("drivers");
    await refDriver
      .orderByChild("status")
      .equalTo(Constants.STATUS_ON)
      .once(
        "value",
        (driverData) => {
          driverData.forEach((driver) => {
            const driverValue = driver.val();
            drivers.push({
              driverId: driver.key,
              latitude: driverValue.latitude,
              longitude: driverValue.longitude,
              status: driverValue.status,
            });
          });
          console.log(drivers);
        },
        (error) => {
          console.log("The read failed: " + error.code);
        }
      );
    if (drivers.length == 0) {
      res.send({ success: true, drivers: [] });
      res.end();
      return;
    }
    const googleMapUrl = "https://maps.googleapis.com/maps";
    Promise.all(
      drivers.map((driver) => {
        return new Promise(async (resolve, reject) => {
          let destination = `${driver.latitude},${driver.longitude}`;
          const payload = {
            origin: `${user.latitude},${user.longitude}`,
            destination: destination,
            key: Constants.GOOGLE_MAP_API_KEY,
          };
          const map = await axios.get(`${googleMapUrl}/api/directions/json`, {
            params: payload,
          });
          driver["distanceOrigin"] = map.data.routes[0].legs[0].distance.value;
          resolve();
        });
      })
    ).then(() => {
      let drivers1km = drivers
        .filter((driver) => driver["distanceOrigin"] <= 1000)
        .map((driver, index) => {
          if (index <= 10) {
            return driver;
          }
        });
      if (drivers1km.length == 10) {
        Driver.find({
          _id: {
            $in: drivers1km.map((driver) => {
              return driver["driverId"];
            }),
          },
        }).then((driversData) => {
          drivers1km = driversData.map((driver) => {
            return {
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
              status: driver.status,
            };
          });
          res.send({ success: true, drivers: drivers1km });
          res.end();
        });
      } else {
        let drivers2km = drivers
          .filter((driver) => driver["distanceOrigin"] <= 2000)
          .map((driver, index) => {
            if (index <= 10) {
              return driver;
            }
            console.log();
          });
        if (drivers2km.length == 10) {
          Driver.find({
            _id: {
              $in: drivers2km.map((driver) => {
                return driver["driverId"];
              }),
            },
          }).then((driversData) => {
            drivers2km = driversData.map((driver) => {
              return {
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
                status: driver.status,
              };
            });
            res.send({ success: true, drivers: drivers2km });
            res.end();
          });
        } else {
          let drivers5km = drivers
            .filter((driver) => driver["distanceOrigin"] <= 5000)
            .map((driver, index) => {
              if (index <= 10) {
                return driver;
              }
            });
          Driver.find({
            _id: {
              $in: drivers5km.map((driver) => {
                return driver["driverId"];
              }),
            },
          }).then((driversData) => {
            drivers5km = driversData.map((driver) => {
              return {
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
                status: driver.status,
              };
            });
            res.send({ success: true, drivers: drivers5km });
            res.end();
          });
        }
      }
    });
  });
};
