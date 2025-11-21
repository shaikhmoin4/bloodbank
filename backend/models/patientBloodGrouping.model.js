import mongoose from "mongoose";

const patientBloodGroupingSchema = mongoose.Schema({

    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blood-request",
        required: true
    },

    // ---- BLOOD GROUP MAIN FIELDS ----
    bloodGroup: {
        method: { type: String },                     // bloodGroup_method
        confirmedBG: { type: String },               // bloodGroup_confirmedBG
        forwardGroup: { type: String },              // bloodGroup_forwardGroup
        reverseGroup: { type: String },              // bloodGroup_reverseGroup
    },

    // ---- FORWARD GROUP SECTION ----
    forwardGroupTests: {
        anti_A: { type: String },                    // forward_anti_A
        anti_B: { type: String },                    // forward_anti_B
        anti_AB: { type: String },                   // forward_anti_AB
        anti_D1: { type: String },                   // forward_anti_D1
        anti_D2: { type: String },                   // forward_anti_D2
        antiA1: { type: String },                    // forward_antiA1
        anti_H: { type: String },                    // forward_anti_H
    },

    // ---- WEAK D ----
    weakD: {
        IgG_M: { type: String },                     // weakD_IgG_M
        IgG_M_2: { type: String },                   // weakD_IgG_M_2
        IgG: { type: String },                       // weakD_IgG
    },

    // ---- REVERSE GROUP ----
    reverseGroupTests: {
        a_Cell: { type: String },                    // reverse_a_Cell
        b_Cell: { type: String },                    // reverse_b_Cell
        o_Cell: { type: String },                    // reverse_o_Cell
    },

    // ---- ANTIGENIC STATUS ----
    antigenicStatus: {
        testedBy: { type: String },                      // testedBy
        remarks: { type: String },
        checkAntigenicStatus: { type: Boolean },     // antigen_status_check
        allowRetest: { type: Boolean },            // antigen_status_allow
    },

    // Validation 
    BGValidation: {
        validationRemark: { type: String },
        validationNote: { type: String },
        validatedBy: { type: String },
        validatedDate: { type: Date },
    },
    // Validation 
    ABValidation: {
        validationRemark: { type: String },
        validationNote: { type: String },
        validatedBy: { type: String },
        validatedDate: { type: Date },
    },

    ABScreening: {
        threeCell: {
            type: String
        },
        antiBody_1: {
            type: String
        },
        antiBody_2: {
            type: String
        },
        antiBody_3: {
            type: String
        },
        antiBody_4: {
            type: String
        },
        testedBy: {
            type: String
        },
        antiBodyStatus: {
            type: String
        },
        auto: {
            type: String
        },
        remark: {
            type: String
        },
    }



}, { timestamps: true });

export default mongoose.model("patient-blood-grouping", patientBloodGroupingSchema);
