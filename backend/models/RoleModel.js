import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // e.g. "user", "seller", "admin"
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission" // link to Permission model
    }
  ],
  is_default: {
    type: Boolean,
    default: false // default role like 'user'
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);
