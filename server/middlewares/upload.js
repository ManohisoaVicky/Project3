import multer from "multer";
import "../uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const uploadFile = multer({ storage }).single("image");

export default uploadFile;
