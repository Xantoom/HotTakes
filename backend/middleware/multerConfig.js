// Imports
const multer = require("multer");

// MimeTypes
const MimeTypes = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
};

/**
 * Stockage de l'image
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const extension = MimeTypes[file.mimetype];
        const name = file.originalname
            .split("." + extension)
            .join("-")
            .split(" ")
            .join("_");

        callback(null, name + Date.now() + "." + extension);
    },
});

module.exports = multer({ storage }).single("image");
