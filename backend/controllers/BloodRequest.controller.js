import mongoose from 'mongoose';
import BloodRequestModel from '../models/bloodRequest.model.js';



export const createBloodRequest = async (req, res) => {

    try {
        const {
            requestType,
            requestSubType,
            patientIdentifier,
            dateOfBirth,
            prescribedSlideBG,
            age,
            ageType,
            gender,
            patientNameF,
            patientNameM,
            patientNameL,
            sampleType,
            patientSampleId,
            sampleQty,
            clinicalDiagnosis,
            otherText,
            transfusionIndication,
            hospitalDetails,
            requestComponents,
            relativeDetails,
            visitorBoy,
            remark,
            requestSampleStatus,
            charges
        } = req.body;

        // Generate patient identifier if not provided
        let finalPatientIdentifier = patientIdentifier;
        if (!finalPatientIdentifier) {
            const count = await BloodRequestModel.countDocuments();
            finalPatientIdentifier = `PI${new Date().getFullYear().toString().slice(-2)}-${(count + 1).toString().padStart(5, '0')}`;
        }

        const newPatient = new BloodRequestModel({
            requestType,
            requestSubType,
            patientIdentifier: finalPatientIdentifier,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            prescribedSlideBG,
            age: age ? parseInt(age) : null,
            ageType,
            gender,
            patientNameF,
            patientNameM,
            patientNameL,
            sampleType,
            patientSampleId,
            sampleQty: sampleQty ? parseFloat(sampleQty) : null,
            clinicalDiagnosis,
            otherText,
            transfusionIndication,
            hospitalDetails: hospitalDetails || {},
            requestComponents: requestComponents || [],
            relativeDetails: relativeDetails || {},
            visitorBoy,
            remark,
            requestSampleStatus: requestSampleStatus || 'pending',
            charges: charges || {
                cmCharge: 0,
                productCharge: 0,
                nat: 0,
                total: 0,
                rateMasterRef: ''
            },
            createdBy: req.user?._id // Assuming you have user authentication
        });


        // Calculate total charges if not provided
        if (!charges?.total && charges) {
            newPatient.charges.total =
                (charges.cmCharge || 0) +
                (charges.productCharge || 0) +
                (charges.nat || 0);
        }

        const savedPatient = await newPatient.save();

        res.status(201).json({
            success: true,
            message: 'Blood request created successfully',
            data: savedPatient
        });
    } catch (error) {
        console.error('Error creating blood request:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating blood request',
            error: error.message
        });
    }
}




// Get all blood requests with pagination and filtering
export const getAllBloodRequests = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            requestType,
            requestSampleStatus,
            startDate,
            endDate,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};

        // Search functionality
        if (search) {
            query.$or = [
                { patientIdentifier: { $regex: search, $options: 'i' } },
                { 'patientNameF': { $regex: search, $options: 'i' } },
                { 'patientNameL': { $regex: search, $options: 'i' } },
                { 'hospitalDetails.hospital': { $regex: search, $options: 'i' } },
                { 'hospitalDetails.doctor': { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by request type
        if (requestType) {
            query.requestType = requestType;
        }

        // Filter by status
        if (requestSampleStatus) {
            query.requestSampleStatus = requestSampleStatus;
        }

        // Date range filter
        if (startDate || endDate) {
            query.requestDateTime = {};
            if (startDate) {
                query.requestDateTime.$gte = new Date(startDate);
            }
            if (endDate) {
                query.requestDateTime.$lte = new Date(endDate);
            }
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const bloodRequests = await BloodRequestModel.find(query)
            .populate('createdBy')
            .populate('updatedBy' )
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await BloodRequestModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: bloodRequests,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching blood requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blood requests',
            error: error.message
        });
    }
};


// Get single blood request by ID
export const getBloodRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blood request ID'
            });
        }

        const bloodRequest = await BloodRequestModel.findById(id)
            .populate('createdBy')
            .populate('updatedBy');

        if (!bloodRequest) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: bloodRequest
        });

    } catch (error) {
        console.error('Error fetching blood request:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blood request',
            error: error.message
        });
    }
};



// Update blood request
export const updateBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blood request ID'
            });
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user?._id
        };

        // Handle date conversion
        if (updateData.dateOfBirth) {
            updateData.dateOfBirth = new Date(updateData.dateOfBirth);
        }

        // Calculate total charges if charges are updated
        if (updateData.charges) {
            const { cmCharge = 0, productCharge = 0, nat = 0 } = updateData.charges;
            updateData.charges.total = cmCharge + productCharge + nat;
        }

        const updatedPatient = await BloodRequestModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy')
            .populate('updatedBy');

        if (!updatedPatient) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blood request updated successfully',
            data: updatedPatient
        });

    } catch (error) {
        console.error('Error updating blood request:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating blood request',
            error: error.message
        });
    }
};

// Delete blood request
export const deleteBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blood request ID'
            });
        }

        const deletedPatient = await BloodRequestModel.findByIdAndDelete(id);

        if (!deletedPatient) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blood request deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting blood request:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting blood request',
            error: error.message
        });
    }
};

// Get blood request statistics
export const getBloodRequestStats = async (req, res) => {
    try {
        const totalRequests = await BloodRequestModel.countDocuments();

        const statusStats = await BloodRequestModel.aggregate([
            {
                $group: {
                    _id: '$requestSampleStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        const typeStats = await BloodRequestModel.aggregate([
            {
                $group: {
                    _id: '$requestType',
                    count: { $sum: 1 }
                }
            }
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayRequests = await BloodRequestModel.countDocuments({
            createdAt: { $gte: today }
        });

        const monthlyStats = await BloodRequestModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalRequests,
                todayRequests,
                statusStats,
                typeStats,
                monthlyStats
            }
        });

    } catch (error) {
        console.error('Error fetching blood request stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};