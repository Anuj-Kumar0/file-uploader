import { prisma } from "../../lib/prisma.js";
import supabase from "../../lib/supabase.js";
import fs from "fs";

export const getUploadPage = async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: req.user.id,
      },
    });

    res.render("upload", { folders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading upload page");
  }
};

export const uploadFile = async (req, res) => {
  const { folderId } = req.body;

  if (!req.file) return res.send("No file");

  const fileBuffer = fs.readFileSync(req.file.path);

  const fileName = Date.now() + "-" + req.file.originalname;

  // upload to supabase
  const { data, error } = await supabase.storage
    .from("files")
    .upload(fileName, fileBuffer);

    if (error) {
      console.error("Supabase upload error:", error);
      return res.send("Upload failed: " + error.message);
    }

  // get public URL
  const { data: publicUrl } = supabase.storage
    .from("files")
    .getPublicUrl(fileName);

  // save in DB
  await prisma.file.create({
    data: {
      filename: req.file.originalname,
      url: publicUrl.publicUrl,
      path: fileName, 
      size: req.file.size,
      userId: req.user.id,
      folderId: folderId ? Number(folderId) : null,
    },
  });

  // delete local file
  fs.unlinkSync(req.file.path);

  res.redirect("/folders");
};