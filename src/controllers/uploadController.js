import { prisma } from "../../lib/prisma.js";
import supabase from "../../lib/supabase.js";
import fs from "fs";

export const getUploadPage = async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id, parentId: null, },
    });

    const files = await prisma.file.findMany({
      where: {
        userId: req.user.id,
        folderId: null,
      },
    });

    res.render("upload", { folders, files, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading upload page");
  }
};

export const uploadFile = async (req, res) => {
  try {
    const { folderId } = req.body;

    if (!req.file) {
      return res.render("upload", {
        folders: await prisma.folder.findMany({ where: { userId: req.user.id } }),
        error: "Please select a file",
      });
    }

    const fileName = Date.now() + "-" + req.file.originalname;
    const fileBuffer = req.file.buffer; // use buffer instead of fs.readFileSync

    // upload to supabase
    const { error } = await supabase.storage.from("files").upload(fileName, fileBuffer);

    if (error) {
      return res.render("upload", {
        folders: await prisma.folder.findMany({ where: { userId: req.user.id } }),
        error: error.message,
      });
    }

    // get public URL
    const { data: publicUrl } = supabase.storage.from("files").getPublicUrl(fileName);

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

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.render("upload", {
      folders: await prisma.folder.findMany({ where: { userId: req.user.id } }),
      error: "Something went wrong",
    });
  }
};