import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    garage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garage",
      required: true,
    },

    role: {
      type: String,
      enum: ["mechanic", "technician", "cleaner", "manager", "support"],
      default: "mechanic",
    },

    status: {
      type: String,
      enum: ["available", "busy", "inactive"],
      default: "available",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
