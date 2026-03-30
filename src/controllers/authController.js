import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
import passport from "passport";
import { validationResult } from "express-validator";

export const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("register", {
      errors: errors.array(),
      old: req.body,
    });
  }

  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.render("register", {
        errors: [{ msg: "Email already exists" }],
        old: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.render("login", {
        error: info.message,
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/upload");
    });
  })(req, res, next);
};

export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};