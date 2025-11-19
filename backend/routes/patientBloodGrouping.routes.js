import express from "express";
import {
    getAllpatientBloodGroup,
    createBloodGrouping,
    getBloodGroupingByPatient,
    updateBloodGrouping,
    saveValidation
} from "../controllers/patientBloodGrouping.controller.js";

const BloodGroupingRoute = express.Router();

// GET ALL BLOOD GROUPING LIST
BloodGroupingRoute.get("/", getAllpatientBloodGroup);

// GET BLOOD GROUPING BY PATIENT ID
BloodGroupingRoute.get("/:id", getBloodGroupingByPatient);

// CREATE
BloodGroupingRoute.post("/:id", createBloodGrouping);


BloodGroupingRoute.put("/validation", saveValidation);

// UPDATE
BloodGroupingRoute.put("/:id", updateBloodGrouping);

export default BloodGroupingRoute;
