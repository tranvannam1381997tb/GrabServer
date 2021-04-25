const Driver = require("./driver.model");
const admin = require("firebase-admin");

const serviceAccount = require("../../../configuration/servicesAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://grab-application-default-rtdb.firebaseio.com",
});

/**
 * create driver
 *
 * @param {*} req
 * @param {*} res
 */
exports.create = async (req, res) => {
  const driverInfo = req.body;
  let driverNew = new Driver();
  driverNew.username = driverInfo.username;
  driverNew.password = driverInfo.password;
  driverNew.name = driverInfo.name;
  driverNew.age = driverInfo.age;
  driverNew.sex = driverInfo.sex;
  driverNew.phoneNumber = driverInfo.phoneNumber;
  let driverSaved = await driverNew.save();
  let driverRef = admin.database().ref(`drivers/${driverSaved._id}`);
  driverRef.set({
    name: driverInfo.name,
    age: driverInfo.age,
    sex: driverInfo.sex,
    phoneNumber: driverInfo.phoneNumber,
    licensePlateNumber: driverInfo.licensePlateNumber,
    typeVehicle: driverInfo.typeVehicle,
    typeDriver: driverInfo.typeDriver,
    startDate: driverInfo.startDate,
    status: 0,
    rate: 5,
    longitude: 0,
    latitude: 0,
    tokenId: "",
  });
  res.send("Create successfully!");
};

/**
 * login
 *
 * @param {*} req
 * @param {*} res
 */
exports.login = (req, res) => {
  const driverInfo = req.body;
  const username = driverInfo.username;
  const password = driverInfo.password;
  Driver.findOne({
    username: username,
    password: password,
  }).then((driver) => {
    console.log(driver);
    if (driver) {
      console.log(driver);
      res.send({ mess: "Login successfully!" });
    } else {
      res.send({ error: "Login failed!" });
    }
    res.end();
  });
};
