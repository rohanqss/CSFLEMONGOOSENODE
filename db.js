const mongoose = require("mongoose");

const dbURI =
  "mongodb+srv://opencitylabstaging:opencity2018@staging-test.pkxml.mongodb.net/opencitylabstaging?retryWrites=true&w=majority";
 const dbURI1="mongodb://localhost:27017/test"
const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI1).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);
require("./models/User")