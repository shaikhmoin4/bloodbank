import express from 'express';
import {
    createBloodRequest,
    getAllBloodRequests,
    getBloodRequestById,
    updateBloodRequest,
    deleteBloodRequest,
    getBloodRequestStats
} from '../controllers/BloodRequest.controller.js';

// Optional: Import middleware for authentication/authorization
// import { auth, authorize } from '../middleware/auth.js';

const Bloodrequestsrouter = express.Router();

// Apply authentication middleware to all routes
// router.use(auth);

// Routes
Bloodrequestsrouter.post('/', createBloodRequest);
Bloodrequestsrouter.get('/', getAllBloodRequests);
Bloodrequestsrouter.get('/stats', getBloodRequestStats);
Bloodrequestsrouter.get('/:id', getBloodRequestById);
Bloodrequestsrouter.put('/:id', updateBloodRequest);
Bloodrequestsrouter.delete('/:id', deleteBloodRequest);

export default Bloodrequestsrouter;