import express from 'express';


import { createHospital,getHospitals ,updateHospital, deleteHospital} from '../controllers/Hospital.controller.js';


const HospitalRoute =express.Router();

HospitalRoute.post('/',createHospital);
HospitalRoute.get('/',getHospitals);
HospitalRoute.put("/:id", updateHospital);

HospitalRoute.delete('/:id',deleteHospital);

export default HospitalRoute;