const express = require("express");
const app = express();

require("dotenv").config({ path: __dirname + "/configuration/.env" });

const bodyParser = require("body-parser");

//configure bodyparser to hande the post requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// welcome default api
app.get("/", (req, res) => {
  res.send("hello world!");
  res.end();
});

// all routes
const routes = require("./api/routes");
app.use("/api", routes);

// listening to the server
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port localhost:${process.env.SERVER_PORT}!`);
});

// import mongodb
const mongoose = require("mongoose");
const option = { useUnifiedTopology: true, useNewUrlParser: true };
// connect to mongodb
const mongoConnection = mongoose.connect(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  option
);
mongoConnection.then(
  () => {
    console.log(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    );
    console.log("connected!");
  },
  (error) => {
    console.log("error: " + error);
  }
);
