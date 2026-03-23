import { prisma } from "../../lib/prisma.js";

// CREATE SHARE LINK
export const createShareLink = async (req, res) => {
  const { folderId, duration } = req.body;

  // convert duration
  const days = parseInt(duration);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const share = await prisma.sharedFolder.create({
    data: {
      folderId: Number(folderId),
      expiresAt,
    },
  });

  const link = `${req.protocol}://${req.get("host")}/share/${share.id}`;
  console.log("Generated link:", link);

  res.render("shareSuccess", { link });
};

// ACCESS SHARED FOLDER (PUBLIC)
export const viewSharedFolder = async (req, res) => {
  const { id } = req.params;
  console.log(req.params.id);

  const shared = await prisma.sharedFolder.findUnique({
    where: { id },
    include: {
      folder: {
        include: {
          files: true,
        },
      },
    },
  });

  if (!shared) return res.send("Invalid link");

  // check expiry
  if (new Date() > shared.expiresAt) {
    return res.send("Link expired");
  }

  res.render("sharedFolder", { folder: shared.folder });
};