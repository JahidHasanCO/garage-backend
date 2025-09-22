import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null,
  },
}, { timestamps: true }); // optional, adds createdAt & updatedAt

const User = mongoose.model("User", userSchema);

export default User;
