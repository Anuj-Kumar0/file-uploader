import { prisma } from "../../lib/prisma.js";
import supabase from "../../lib/supabase.js"; 

export const createFolder = async (req, res) => {
  const { name, parentId } = req.body;

  await prisma.folder.create({
    data: {
      name,
      userId: req.user.id,
      parentId: parentId ? Number(parentId) : null,
    },
  });

  // redirect back to parent folder if exists
  if (parentId) {
    return res.redirect(`/folders/${parentId}`);
  }

  res.redirect("/folders");
};

export const getFolders = async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id, parentId: null, },
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
        children: true,
      },
    });

    if (!folder) {
      return res.status(404).render("error", {
        status: 404,
        message: "Folder not found",
      });
    }

    res.render("folderDetails", { folder, currentFolder: folder });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching folder");
  }
};

const deleteFolderRecursive = async (folderId) => {
  // 1. find subfolders
  const subfolders = await prisma.folder.findMany({
    where: { parentId: folderId },
  });

  // 2. delete subfolders first
  for (const sub of subfolders) {
    await deleteFolderRecursive(sub.id);
  }

  // 3. delete files in this folder
  const files = await prisma.file.findMany({
    where: { folderId },
  });

  for (const file of files) {
    if (!file.path) continue;

    const { error } = await supabase.storage
      .from("files")
      .remove([file.path]);

    if (error) {
      console.error("Failed deleting:", file.path);
    }
  }

  // 4. delete folder
  await prisma.folder.delete({
    where: { id: folderId },
  });
};

export const deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteFolderRecursive(Number(id));

    res.redirect("/folders");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete folder");
  }
};