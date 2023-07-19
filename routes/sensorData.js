import express from "express";
import {
digestSensorData,
getSensorData,
} from "../controllers/sensorData.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/", verifyToken, digestSensorData);
router.get('/:serialNb', getSensorData);

export default router;
