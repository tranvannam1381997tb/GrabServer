const Driver = require("./driver.model");
const admin = require("firebase-admin");
const Constants = require("../../../utils/constants");
var { DateTime } = require("luxon");
const { timer, Subject, pipe, async } = require("rxjs");
const { startWith, switchMap, takeUntil } = require("rxjs/operators");

const pauseTimerCheckStatusSubject = new Subject();
const resetTimerCheckStatusSubject = new Subject();

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
  driverNew.totalBook = 0;
  const driverSaved = await driverNew.save();
  const driverRef = admin.database().ref(`drivers/${driverSaved._id}`);
  await driverRef.set({
    longitude: 0,
    latitude: 0,
    status: driverSaved.status,
    tokenId: "",
  });
  this.changeStatus(driverSaved);
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
    this.changeStatus(driver);
    // const resetTimer = new Subject();
    // const pauseTimer = new Subject();
    // resetTimer
    //   .pipe(
    //     startWith(0),
    //     switchMap(() => timer(0, 1000)),
    //     takeUntil(pauseTimer)
    //   )
    //   .subscribe(async (val) => {
    //     if (val > 60) {
    //       Driver.findById(driver._id).then(async (driverData) => {
    //         if (driverData.status == Constants.STATUS_ON) {
    //           // update to firebase
    //           await driverRef.update({
    //             status: Constants.STATUS_OFF,
    //           });
    //           // update to mongodb
    //           await Driver.updateOne(
    //             { _id: driver._id },
    //             {
    //               status: Constants.STATUS_OFF,
    //             }
    //           );
    //         }
    //       });
    //     }
    //   });
    // resetTimerCheckStatusSubject.subscribe((val) => {
    //   if (val == driver._id) {
    //     Driver.findById(val).then(async (driverData) => {
    //       if (driverData.status == Constants.STATUS_OFF) {
    //         // update to firebase
    //         await driverRef.update({
    //           status: Constants.STATUS_ON,
    //         });
    //         // update to mongodb
    //         await Driver.updateOne(
    //           { _id: driver._id },
    //           {
    //             status: Constants.STATUS_ON,
    //           }
    //         );
    //       }
    //       resetTimer.next();
    //     });
    //   }
    // });
    // pauseTimerCheckStatusSubject.subscribe((val) => {
    //   if (val == driver._id) {
    //     pauseTimer.next();
    //     pauseTimer.unsubscribe();
    //   }
    // });
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
        totalBook: driver.totalBook,
      },
    });
    res.end();
  });
};

/**
 * arriving origin
 *
 * @param {*} req
 * @param {*} res
 */
exports.arrivingOrigin = async (req, res) => {
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
 * arrived origin
 *
 * @param {*} req
 * @param {*} res
 */
exports.arrivedOrigin = async (req, res) => {
  const driverInfo = req.body;
  // update to firebase
  const driverRef = admin.database().ref(`drivers/${driverInfo.driverId}`);
  await driverRef.update({
    status: Constants.STATUS_ARRIVED_ORIGIN,
  });
  // update to mongodb
  await Driver.updateOne(
    { _id: driverInfo.driverId },
    {
      status: Constants.STATUS_ARRIVED_ORIGIN,
    }
  );
  res.send({ success: true });
  res.end();
};

/**
 * arriving destination
 *
 * @param {*} req
 * @param {*} res
 */
exports.arrivingDestination = async (req, res) => {
  const driverInfo = req.body;
  // update to firebase
  const driverRef = admin.database().ref(`drivers/${driverInfo.driverId}`);
  await driverRef.update({
    status: Constants.STATUS_ARRIVING_DESTINATION,
  });
  // update to mongodb
  await Driver.updateOne(
    { _id: driverInfo.driverId },
    {
      status: Constants.STATUS_ARRIVING_DESTINATION,
    }
  );
  res.send({ success: true });
  res.end();
};

/**
 * arrived destination
 *
 * @param {*} req
 * @param {*} res
 */
exports.arrivedDestination = async (req, res) => {
  const driverInfo = req.body;
  // update to firebase
  const driverRef = admin.database().ref(`drivers/${driverInfo.driverId}`);
  await driverRef.update({
    status: Constants.STATUS_ARRIVED_DESTINATION,
  });
  // update to mongodb
  await Driver.updateOne(
    { _id: driverInfo.driverId },
    {
      status: Constants.STATUS_ARRIVED_DESTINATION,
    }
  );
  res.send({ success: true });
  res.end();
};

/**
 * billing
 *
 * @param {*} req
 * @param {*} res
 */
exports.billing = async (req, res) => {
  const driverInfo = req.body;
  // update to firebase
  const driverRef = admin.database().ref(`drivers/${driverInfo.driverId}`);
  let driver = await Driver.findOne({
    _id: driverInfo.driverId,
  });
  await driverRef.update({
    status: Constants.STATUS_ON,
  });
  // update to mongodb
  await Driver.updateOne(
    { _id: driverInfo.driverId },
    {
      status: Constants.STATUS_ON,
      totalBook: ++driver.totalBook,
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
exports.cancel = async (req, res) => {
  res.send({ success: true });
};

/**
 * update status
 *
 * @param {*} req
 * @param {*} res
 */
exports.updateStatus = (req, res) => {
  const driverId = req.body.driverId;
  resetTimerCheckStatusSubject.next(driverId);
  res.send({ success: true });
};

/**
 * logout
 *
 * @param {*} req
 * @param {*} res
 */
exports.logout = (req, res) => {
  const driverId = req.body.driverId;
  pauseTimerCheckStatusSubject.next(driverId);
  res.send({ success: true });
};

/**
 *
 * @param {*} driver
 */
exports.changeStatus = (driver) => {
  const driverRef = admin.database().ref(`drivers/${driver._id}`);
  const resetTimer = new Subject();
  const pauseTimer = new Subject();
  const subscription = resetTimer
    .pipe(
      startWith(0),
      switchMap(() => timer(0, 1000)),
      takeUntil(pauseTimer)
    )
    .subscribe(async (val) => {
      if (val > 60) {
        Driver.findById(driver._id).then(async (driverData) => {
          if (driverData.status == Constants.STATUS_ON) {
            // update to firebase
            await driverRef.update({
              status: Constants.STATUS_OFF,
            });
            // update to mongodb
            await Driver.updateOne(
              { _id: driver._id },
              {
                status: Constants.STATUS_OFF,
              }
            );
          }
        });
      }
    });
  resetTimerCheckStatusSubject.subscribe((val) => {
    if (val == driver._id) {
      Driver.findById(val).then(async (driverData) => {
        if (driverData.status == Constants.STATUS_OFF) {
          // update to firebase
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
        }
        resetTimer.next();
      });
    }
  });
  pauseTimerCheckStatusSubject.subscribe((val) => {
    if (val == driver._id) {
      Driver.findById(val).then(async (driverData) => {
        if (driverData.status == Constants.STATUS_ON) {
          // update to firebase
          await driverRef.update({
            status: Constants.STATUS_OFF,
          });
          // update to mongodb
          await Driver.updateOne(
            { _id: driver._id },
            {
              status: Constants.STATUS_OFF,
            }
          );
        }
      });
      subscription.unsubscribe();
    }
  });
};
