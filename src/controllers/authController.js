import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
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

export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};