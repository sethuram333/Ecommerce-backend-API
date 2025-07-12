const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  phone:{type:Number}
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
