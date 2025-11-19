import BloodRequestModel from "../models/bloodRequest.model.js";
import patientBloodGroupingModel from "../models/patientBloodGrouping.model.js";


// ------------------------------
// CREATE BLOOD GROUPING RECORD
// ------------------------------
export const createBloodGrouping = async (req, res) => {
    try {
        const patientID = req.params.id;
        const data = req.body;

        // Check valid patient
        const patient = await BloodRequestModel.findById(patientID);
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        const payload = {
            patientID,

            bloodGroup: {
                method: data.bloodGroup_method,
                confirmedBG: data.bloodGroup_confirmedBG,
                forwardGroup: data.bloodGroup_forwardGroup,
                reverseGroup: data.bloodGroup_reverseGroup,
            },

            forwardGroupTests: {
                anti_A: data.forward_anti_A,
                anti_B: data.forward_anti_B,
                anti_AB: data.forward_anti_AB,
                anti_D1: data.forward_anti_D1,
                anti_D2: data.forward_anti_D2,
                antiA1: data.forward_antiA1,
                anti_H: data.forward_anti_H,
            },

            weakD: {
                IgG_M: data.weakD_IgG_M,
                IgG_M_2: data.weakD_IgG_M_2,
                IgG: data.weakD_IgG,
            },

            reverseGroupTests: {
                a_Cell: data.reverse_a_Cell,
                b_Cell: data.reverse_b_Cell,
                o_Cell: data.reverse_o_Cell,
            },

            antigenicStatus: {
                checkAntigenicStatus: data.antigen_status_check === "true",
                allowRetest: data.antigen_status_allow === "true",
            },

            testedBy: data.testedBy,
            remarks: data.remarks,
        };

        const saved = await patientBloodGroupingModel.create(payload);

        res.status(201).json({
            success: true,
            message: "Blood grouping saved successfully",
            data: saved
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};


export const getAllpatientBloodGroup = async (req, res) => {
    try {
        const list = await patientBloodGroupingModel.find()
            .populate("patientID");   // <-- correct populate

        res.status(200).json({
            success: true,
            data: list
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error
        });
    }
};

// ------------------------------
// GET BLOOD GROUPING BY PATIENT ID
// ------------------------------
export const getBloodGroupingByPatient = async (req, res) => {
    try {
        const id = req.params.id;

         const record = await patientBloodGroupingModel.findById(req.params.id)
            .populate("patientID");

        res.status(200).json({
            success: true,
            data: record  // <-- ARRAY
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};



// ------------------------------
// UPDATE BLOOD GROUPING
// ------------------------------
export const updateBloodGrouping = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const payload = {
            bloodGroup: {
                method: data.bloodGroup_method,
                confirmedBG: data.bloodGroup_confirmedBG,
                forwardGroup: data.bloodGroup_forwardGroup,
                reverseGroup: data.bloodGroup_reverseGroup,
            },
            forwardGroupTests: {
                anti_A: data.forward_anti_A,
                anti_B: data.forward_anti_B,
                anti_AB: data.forward_anti_AB,
                anti_D1: data.forward_anti_D1,
                anti_D2: data.forward_anti_D2,
                antiA1: data.forward_antiA1,
                anti_H: data.forward_anti_H,
            },
            weakD: {
                IgG_M: data.weakD_IgG_M,
                IgG_M_2: data.weakD_IgG_M_2,
                IgG: data.weakD_IgG,
            },
            reverseGroupTests: {
                a_Cell: data.reverse_a_Cell,
                b_Cell: data.reverse_b_Cell,
                o_Cell: data.reverse_o_Cell,
            },
            antigenicStatus: {
                checkAntigenicStatus: data.antigen_status_check === "true",
                allowRetest: data.antigen_status_allow === "true",
            },
            testedBy: data.testedBy,
            remarks: data.remarks,
        };

        const updated = await patientBloodGroupingModel.findOneAndUpdate(
            { patientID: id },
            payload,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Blood grouping updated successfully",
            data: updated
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};



export const saveValidation = async (req, res) => {
    try {
        const { remarks, validatedBy, validatedDate } = req.body;

        // remarks = { "recordId": { remark: "Valid", note: "sample ok" } }

        const updates = Object.keys(remarks).map(async (id) => {
            return await patientBloodGroupingModel.findByIdAndUpdate(
                id,
                {
                    validationRemark: remarks[id].remark,
                    validationNote: remarks[id].note,
                    validatedBy,
                    validatedDate,
                },
                { new: true }
            );
        });

        await Promise.all(updates);

        res.status(200).json({
            success: true,
            message: "Validation updated successfully",
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};




