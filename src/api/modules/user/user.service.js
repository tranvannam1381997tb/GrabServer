const User = require("./user.model");
const axios = require("axios");
const Constants = require("../../../utils/constants");
const admin = require("firebase-admin");

/**
 * create user
 *
 * @param {*} req
 * @param {*} res
 */
exports.create = async (req, res) => {
  const userInfo = req.body;
  let userNew = new User();
  userNew.username = userInfo.username;
  userNew.password = userInfo.password;
  userNew.name = userInfo.name;
  userNew.age = userInfo.age;
  userNew.sex = userInfo.sex;
  userNew.phoneNumber = userInfo.phoneNumber;
  let userSaved = await userNew.save();
  let userRef = admin.database().ref(`users/${userSaved._id}`);
  userRef.set({
    name: userInfo.name,
    age: userInfo.age,
    sex: userInfo.sex,
    phoneNumber: userInfo.phoneNumber,
    status: 0,
    longitude: 0,
    latitude: 0,
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
  const userInfo = req.body;
  const username = userInfo.username;
  const password = userInfo.password;
  User.findOne({
    username: username,
    password: password,
  }).then((user) => {
    if (user) {
      // return id user
      console.log(user);
      res.send({
        mess: "Login successfully.",
        userId: 1,
      });
    } else {
      res.send({ error: "Login failed." });
    }
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
  const user = await User.find();
  console.log(user);

  // const origin = `21.0462746,105.7948588`;
  // const destination = `20.9898719,105.7972325`;
  // const googleMapUrl = "https://maps.googleapis.com/maps";
  // const payload = {
  //   origin: origin,
  //   destination: destination,
  //   key: Constants.GOOGLE_MAP_API_KEY,
  // };
  // const map = await axios.get(`${googleMapUrl}/api/directions/json`, {
  //   params: payload,
  // });
  // console.log(map.data.routes[0].legs[0].distance);
  // console.log(map.data.routes[0].legs[0].start_location);
  // var db = admin.database();
  // var ref = db.ref("drivers");
  // ref
  //   .orderByChild("status")
  //   .equalTo(1)
  //   .once(
  //     "value",
  //     (snapshot) => {
  //       console.log(snapshot.val());
  //     },
  //     (error) => {
  //       console.log("The read failed: " + error.code);
  //     }
  //   );
  res.send({ mess: "Done." });
};
