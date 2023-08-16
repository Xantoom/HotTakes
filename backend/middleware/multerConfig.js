// Imports
const multer = require("multer");
const fs = require("fs");

// Si le dossier images n'existe pas, on le crée
const dir = "./images";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

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
