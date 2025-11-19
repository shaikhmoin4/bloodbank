import HospitalModel from '../models/Hospital.model.js';


export const createHospital = async (req, res) => {


    try {
        const hospital = await HospitalModel.create(req.body);

        res.status(201).json({ success: true, data: hospital });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


// GET All Hospitals
export const getHospitals = async (req, res) => {
    try {
        const hospitals = await HospitalModel.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: hospitals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateHospital = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await HospitalModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Hospital updated successfully",
            data: updated
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const deleteHospital = async (req, res) => {

    try {
        const { id } = req.params;
        const hospital = await HospitalModel.findByIdAndDelete(id);
        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital Not Found"
            });

        }
        res.status(200).json({
            success: true,
            message: "Hospital deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}