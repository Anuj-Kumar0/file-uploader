import multer from "multer";

// allowed file types
const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

//memory storage
const storage = multer.memoryStorage();

// file filter (type validation)
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, PDF allowed."));
  }
};

// size limit
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter,
});

export default upload;