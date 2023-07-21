// Imports
const router = require("express").Router();
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multerConfig");

// Définitions de toutes les routes
router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
