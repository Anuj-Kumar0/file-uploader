import express from "express";
import upload from "../middleware/multer.js";
import { uploadFile } from "../controllers/uploadController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, (req, res) => {
    res.render("upload");
  });
  
  router.post("/", isAuthenticated, upload.single("file"), uploadFile);

export default router;