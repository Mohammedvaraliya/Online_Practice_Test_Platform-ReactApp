const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
