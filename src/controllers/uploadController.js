export const uploadFile = (req, res) => {
    res.json({
      message: "File uploaded",
      file: req.file,
    });
  };