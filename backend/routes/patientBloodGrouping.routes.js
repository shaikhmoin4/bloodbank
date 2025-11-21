import express from "express";
import {
    getAllpatientBloodGroup,
    createBloodGrouping,
    getBloodGroupingByPatient,
    updateBloodGrouping,
    saveBGValidation,
    saveABValidation,
    saveABScreening
} from "../controllers/patientBloodGrouping.controller.js";

const BloodGroupingRoute = express.Router();

// GET ALL BLOOD GROUPING LIST
BloodGroupingRoute.get("/", getAllpatientBloodGroup);

// GET BLOOD GROUPING BY PATIENT ID
BloodGroupingRoute.get("/:id", getBloodGroupingByPatient);

// CREATE
BloodGroupingRoute.post("/:id", createBloodGrouping);

BloodGroupingRoute.put("/ab-screening/:id", saveABScreening);

BloodGroupingRoute.put("/validation", saveBGValidation);
BloodGroupingRoute.put("/ab-validation", saveABValidation);

// UPDATE
BloodGroupingRoute.put("/:id", updateBloodGrouping);

export default BloodGroupingRoute;
