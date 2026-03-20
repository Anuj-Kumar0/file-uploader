import express from "express";
import {
  getFileDetails,
  downloadFile,
} from "../controllers/fileController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", isAuthenticated, getFileDetails);
router.get("/:id/download", isAuthenticated, downloadFile);

export default router;