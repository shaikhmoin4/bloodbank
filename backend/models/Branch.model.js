// models/Branch.js
import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'hospital', required: true },
    name: { type: String, required: true },
    description: {
        type: String
    },
    email: {
        type: String
    },
    address: { type: String },
    contry: {
        type: String
    },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    phone: { type: String },

    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);
