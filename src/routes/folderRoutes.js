import express from "express";
import {
  createFolder,
  getFolders,
  deleteFolder,
} from "../controllers/folderController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getFolders);
router.post("/", isAuthenticated, createFolder);
router.post("/delete/:id", isAuthenticated, deleteFolder);

export default router;