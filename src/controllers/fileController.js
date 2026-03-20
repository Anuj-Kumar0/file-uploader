import { prisma } from "../../lib/prisma.js";

export const getFileDetails = async (req, res) => {
  const { id } = req.params;

  const file = await prisma.file.findUnique({
    where: { id: Number(id) },
  });
  

  if (!file || file.userId !== Number(req.user.id)) {
    return res.status(403).send("Unauthorized");
  }

  res.render("fileDetails", { file });
};

export const downloadFile = async (req, res) => {
  const { id } = req.params;

  const file = await prisma.file.findUnique({
    where: { id: Number(id) },
  });

  if (!file || file.userId !== Number(req.user.id)) {
    return res.status(403).send("Unauthorized");
  }

  res.download(file.path, file.filename);
};