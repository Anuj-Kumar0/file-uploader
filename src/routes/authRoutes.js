import express from "express";
import passport from "passport";
import { registerUser, logoutUser, loginUser } from "../controllers/authController.js";
import { registerValidation } from "../validators/authValidator.js";

const router = express.Router();

router.get("/register", (req, res) => res.render("register", { errors: [], old: {} }));
router.get("/login", (req, res) => res.render("login", { error: null }));

router.post("/register", registerValidation, registerUser);

router.post(
  "/login", loginUser);

router.get("/logout", logoutUser);

export default router;