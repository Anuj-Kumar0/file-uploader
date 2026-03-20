import { prisma } from "../../lib/prisma.js";

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

  await prisma.file.create({
    data: {
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      userId: req.user.id,
      folderId: folderId ? Number(folderId) : null,
    },
  });

  res.redirect("/folders");
};