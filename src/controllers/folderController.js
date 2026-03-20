import { prisma } from "../../lib/prisma.js";

export const createFolder = async (req, res) => {
  const { name } = req.body;

  await prisma.folder.create({
    data: {
      name,
      userId: req.user.id,
    },
  });

  res.redirect("/folders");
};

export const getFolders = async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
    include: { files: true },
  });

  res.render("folders", { folders });
};

export const deleteFolder = async (req, res) => {
  const { id } = req.params;

  await prisma.folder.delete({
    where: { id: Number(id) },
  });

  res.redirect("/folders");
};