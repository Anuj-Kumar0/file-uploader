import { prisma } from "../../lib/prisma.js";
import supabase from "../../lib/supabase.js"; 

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

export const getFolderById = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await prisma.folder.findFirst({
      where: {
        id: Number(id),
        userId: req.user.id, // security check
      },
      include: {
        files: true,
      },
    });

    if (!folder) {
      return res.status(404).render("error", {
        status: 404,
        message: "Folder not found",
      });
    }

    res.render("folderDetails", { folder });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching folder");
  }
};

export const deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const files = await prisma.file.findMany({
      where: { folderId: Number(id) },
    });

    // Delete files from Supabase one by one
    for (const file of files) {
      if (!file.path) continue;

      const { error } = await supabase.storage
        .from("files")
        .remove([file.path]); 
        console.log("Deleting path:", file.path);

      if (error) console.error(`Failed to delete ${file.path} from Supabase:`, error.message);
      else console.log(`Deleted ${file.path} from Supabase`);
    }

    // Delete folder (cascade deletes file records in DB)
    await prisma.folder.delete({
      where: { id: Number(id) },
    });

    res.redirect("/folders");
  } catch (err) {
    console.error("Failed to delete folder:", err);
    res.status(500).send("Failed to delete folder");
  }
};