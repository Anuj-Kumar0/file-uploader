import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import passport from "./config/passport.js";
import { prisma } from "../lib/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // clean expired sessions every 2 min
      dbRecordIdIsSessionId: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.session());

app.get("/", (req, res) => {
  res.redirect("/upload");
});

app.use("/", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/folders", folderRoutes);
app.use("/files", fileRoutes);
app.use("/share", shareRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = err.status || 500;
  
    res.status(statusCode);
  
    res.render("error", {
      message: err.message || "Internal Server Error",
      status: statusCode,
    });
  });
  
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is Live! - listening on port ${PORT}!`);
  });