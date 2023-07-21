// Imports
const router = require("express").Router();
const userCtrl = require("../controllers/user");
const checkEmail = require("../middleware/checkEmail");

// Définitions de toutes les routes
router.post("/signup", checkEmail, userCtrl.userSignUp);
router.post("/login", userCtrl.userLogin);

module.exports = router;
