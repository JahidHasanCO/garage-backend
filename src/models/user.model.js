import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
  refresh_token: {
    type: String,
    default: null,
  },
  role_id: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // optional, adds createdAt & updatedAt

const User = mongoose.model("User", userSchema);

export default User;
