import mongoose from "mongoose";

const { Schema } = mongoose;

const RequestComponentSchema = new Schema({
  component: { type: String, required: true }, // e.g. "PRBC", "Platelets"
  quantity: { type: Number, required: true, min: 0 },
  volume: { type: String }, // e.g. "350 ml"
  no: { type: String }, // "No" column in form
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const HospitalDetailsSchema = new Schema({
  hospital: { type: String },
  doctor: { type: String },
  department: { type: String },
  hospitalIPNo: { type: String },
  sanctionReceiptNo: { type: String },
  wardRoomBedNo: { type: String }
}, { _id: false });

const RelativeDetailsSchema = new Schema({
  relativeName: { type: String },
  mobileNo: { type: String },
  address: { type: String }
}, { _id: false });

const ChargesSchema = new Schema({
  cmCharge: { type: Number, default: 0 },
  productCharge: { type: Number, default: 0 },
  nat: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  rateMasterRef: { type: String } // optional reference/string for Rate Master link
}, { _id: false });

const PatientSchema = new Schema({

  caseID: { type: String },
  orderNo: { type: String },


  // --- Patient / Request main details ---
  requestType: { type: String, required: true },
  requestSubType: { type: String, required: true },

  patientIdentifier: { type: String }, // e.g. PI25-02794
  dateOfBirth: { type: Date },
  prescribedSlideBG: { type: String }, // Prescribed/Slide BG
  age: { type: Number },
  ageType: { type: String, enum: ['Y', 'M', 'D', 'Unknown'], default: 'Unknown' },

  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Unknown'], default: 'Unknown' },

  patientNameF: { type: String },
  patientNameM: { type: String },
  patientNameL: { type: String },

  sampleType: { type: String },
  patientSampleId: { type: String },
  sampleQty: { type: Number, min: 0 },
  clinicalDiagnosis: { type: String },

  otherText: { type: String },
  transfusionIndication: { type: String },

  // --- Hospital details ---
  hospitalDetails: { type: HospitalDetailsSchema },

  // --- Request details ---
  requestComponents: { type: [RequestComponentSchema], default: [] },
  requestDateTime: { type: Date, default: Date.now },

  // --- Relative / Visitor ---
  relativeDetails: { type: RelativeDetailsSchema },
  visitorBoy: { type: String },

  // --- Remark / status ---
  remark: { type: String },
  requestSampleStatus: {
    type: String,
    enum: [
      'approve_request',
      'approve_and_keep_pending',
      'reject_blood_sample',
      'pending',
      'unknown'
    ],
    default: 'pending'

  },

  // --- Charges & rate ---
  charges: { type: ChargesSchema },

 

  // --- audit / meta ---
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },

  // --- extra fields (optional) ---
  extra: { type: Schema.Types.Mixed }

}, { timestamps: true });

// -------------- FIXED PRE HOOK -----------------
PatientSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    // IMPORTANT: use mongoose.models[] (NO RE-COMPILE)
    const BloodRequest =
      mongoose.models["blood-request"] ||
      mongoose.model("blood-request", PatientSchema);

    const lastRecord = await BloodRequest.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastRecord && lastRecord.caseID) {
      const lastNum = parseInt(lastRecord.caseID.split("B-")[1]);
      nextNumber = lastNum + 1;
    }

    this.caseID = `B-${nextNumber}`;
    this.orderNo = `B-${nextNumber}`;

    next();
  } catch (err) {
    next(err);
  }
});




PatientSchema.index({ caseID: 1 });
PatientSchema.index({ orderNo: 1 });

// Indexes
PatientSchema.index({ patientIdentifier: 1 });
PatientSchema.index({ 'hospitalDetails.hospital': 1 });



export default mongoose.models["blood-request"] ||
  mongoose.model("blood-request", PatientSchema);
