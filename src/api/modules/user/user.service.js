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
  res.send({ success: "Create successfully." });
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
      success: "Login successfully.",
      userId: user._id,
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
