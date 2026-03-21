import { prisma } from "../../lib/prisma.js";
import supabase from "../../lib/supabase.js";

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

  // download from Supabase
  const { data, error } = await supabase.storage
    .from("files")
    .download(file.path);

  if (error) return res.status(500).send("Error downloading file");

  // convert to Buffer (Node.js)
  const buffer = Buffer.from(await data.arrayBuffer());

  // set headers for download
  res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
  res.setHeader("Content-Type", "application/octet-stream");
  res.send(buffer);
};