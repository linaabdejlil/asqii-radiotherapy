const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer"); // Ensure multer is required here

cloudinary.config({
  cloud_name: "dbxkvrsyc",
  api_key: "925631888622694",
  api_secret: "Pf5mHKUXXxajdAQnjFexxFNFBF8",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "radiotherapie",
    resource_type: "auto", // Automatically detect the resource type
    public_id: (req, file) => "uploaded_" + Date.now(),
    allowed_formats: [
      "jpg",
      "png",
      "jpeg",
      "gif",
      "webp",
      "pdf",
      "docx",
      "mp4",
      "txt",
      "zip",
      "PDF",
    ],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
