const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  bloodType:{
      type:String
  },
  ssn:{
      type:String
  }

});

module.exports = mongoose.model("Users", TaskSchema);