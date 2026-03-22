import express from "express";
import {
  createFolder,
  getFolders,
  deleteFolder,
  getFolderById
} from "../controllers/folderController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getFolders);
router.get("/:id", isAuthenticated, getFolderById);
router.post("/", isAuthenticated, createFolder);
router.post("/delete/:id", isAuthenticated, deleteFolder);

export default router;