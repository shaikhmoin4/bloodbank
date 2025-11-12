import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true
  },
  module: {
    type: String, // e.g. "user", "product", "order"
    required: true,
    trim: true
  },
  can_create: {
    type: Boolean,
    default: false
  },
  can_read: {
    type: Boolean,
    default: true
  },
  can_update: {
    type: Boolean,
    default: false
  },
  can_delete: {
    type: Boolean,
    default: false
  },

  can_view:{
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Permission", permissionSchema);
