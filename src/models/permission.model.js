import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
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

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
