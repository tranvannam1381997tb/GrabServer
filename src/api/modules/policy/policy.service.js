const { DateTime } = require("luxon");
const Policy = require("./policy.model");

exports.createPolicy = async (req, res) => {
  let policys = [];
  for (let index = 0; index < 3; index++) {
    let policy = new Policy();
    policy.timeFrame = index;
    if (index == 0) {
      policy.policy = {
        priceOfKilometer: 5000,
        point: {
          ratePoint: 0.7,
          distancePoint: 0.5,
          agePoint: 0.3,
        },
      };
    } else if (index == 1) {
      policy.policy = {
        priceOfKilometer: 6000,
        point: {
          ratePoint: 0.5,
          distancePoint: 0.8,
          agePoint: 0.2,
        },
      };
    } else {
      policy.policy = {
        priceOfKilometer: 7000,
        point: {
          ratePoint: 0.8,
          distancePoint: 0.3,
          agePoint: 0.4,
        },
      };
    }
    policys.push(policy);
  }
  Policy.insertMany(policys).then(() => {
    res.send({ success: true });
    res.end();
  });
};

exports.updatePolicy = async (req, res) => {
  res.end();
};

const peakHoursFrom1 = DateTime.fromFormat("07:00", "HH:mm").toMillis();
const peakHoursTo1 = DateTime.fromFormat("09:00", "HH:mm").toMillis();
const peakHoursFrom2 = DateTime.fromFormat("17:00", "HH:mm").toMillis();
const peakHoursTo2 = DateTime.fromFormat("19:00", "HH:mm").toMillis();
const lateHoursFrom = DateTime.fromFormat("22:00", "HH:mm").toMillis();
const lateHoursTo = DateTime.fromFormat("06:00", "HH:mm").toMillis();

exports.getPolicy = async (req, res) => {
  const now = DateTime.now().toMillis();
  let timeFrame;
  if (
    (now >= peakHoursFrom1 && now <= peakHoursTo1) ||
    (now >= peakHoursFrom2 && now <= peakHoursTo2)
  ) {
    timeFrame = 1;
  } else if (now >= lateHoursFrom || now <= lateHoursTo) {
    timeFrame = 2;
  } else {
    timeFrame = 0;
  }
  Policy.findOne({
    timeFrame: timeFrame,
  }).then((data) => {
    res.send({ success: true, policy: data.policy });
    res.end();
  });
};
