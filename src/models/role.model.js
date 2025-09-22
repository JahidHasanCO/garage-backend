import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
},{
  timestamps: true,
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
