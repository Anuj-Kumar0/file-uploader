import express from "express";
import upload from "../middleware/multer.js";
import { uploadFile, getUploadPage } from "../controllers/uploadController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getUploadPage);

router.post("/", isAuthenticated, upload.single("file"), uploadFile);

export default router;