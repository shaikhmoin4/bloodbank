// models/Hospital.js (optional, minimal)
import mongoose from 'mongoose';

const HospitalSchema = new mongoose.Schema({
    HospitalName: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    contactNo: {
        type: Number
    },
    faxNO: {
        type: Number
    },
    disatanceFormBB: {
        type: String
    },

    maintainCreditLegder: { type: Boolean, default: false },

    contactDetails: {

        preferedContact: { type: Boolean, default: false },
        rmo: { type: Boolean, default: false },

        contactPerson: {
            type: Number
        },
        designation: {
            type: String
        },
        mobileNo_1: {
            type: Number
        },
        phoneNo: {
            type: Number
        },
        mobileNo_2: {
            type: Number
        },

        emailID: {
            type: String
        },
        remarks: {
            type: String
        }

    },

    createdAt: { type: Date, default: Date.now }
});


const HospitalModel = mongoose.model("hospital", HospitalSchema);

export default HospitalModel;
