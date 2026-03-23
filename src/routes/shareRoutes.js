import express from "express";
import {
  createShareLink,
  viewSharedFolder,
} from "../controllers/shareController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createShareLink);

router.get("/:id", viewSharedFolder);

export default router;