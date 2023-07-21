const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/**
 * Schéma de données pour un utilisateur
 * @type {*}
 */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
