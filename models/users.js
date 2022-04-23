const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    role: { type: String, enum: ["admin", "user"], default: 'user' },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
