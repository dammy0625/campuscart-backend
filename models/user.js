const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true, sparse: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // ❗️ Only require password if googleId is not present
    },
  },
  whatsapp: {
    type: String,
    default: "", // Optional field to store WhatsApp number
  },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;
