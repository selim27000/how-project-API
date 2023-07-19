import express from "express";
import mongoose from "mongoose";
import {getHive, getUserHives, getApiaryHives, getHiveNames, createHive, updateHive, deleteHive, transhumance} from "../controllers/hive.js";
import {createHiveReport, createDraftReport, getReports, getReportById} from "../controllers/report.js";
import { verifyToken } from "../middleware/auth.js";

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

router.param("id", (req, res, next, id) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID unknown " + req.params.id });
    } else {
      next();
    }
  });
  
  router.post("/", createHive);
  router.get('/', getUserHives);
  router.get('/names', getHiveNames);
  router.get('/:id', getHive);
  router.get('/apiaries/:apiaryId', getApiaryHives);
  router.patch("/:id", updateHive);
  router.delete("/:id", deleteHive);
  router.post("/transhumance/", transhumance);

  // Report
  router.post("/report/:id", createHiveReport);
  router.post("/draftReport/:id", createDraftReport);
  router.get("/draftReport/list/:id", getReports);
  router.get("/draftReport/:id", getReportById);




export default router;