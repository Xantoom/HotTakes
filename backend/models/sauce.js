// Imports
const mongoose = require("mongoose");

/**
 * On crée un schéma de données qui contient les champs souhaités pour chaque sauce, les champs sont requis ou non selon les besoins
 * @type {*}
 */
const SauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, require: true },
    manufacturer: { type: String, require: true },
    description: { type: String, require: true },
    mainPepper: { type: String, require: true },
    imageUrl: { type: String, require: true },
    heat: { type: Number, require: true },
    likes: { type: Number, require: true, default: 0 },
    dislikes: { type: Number, require: true, default: 0 },
    usersLiked: { type: Array },
    usersDisliked: { type: Array },
});

module.exports = mongoose.model("Sauce", SauceSchema);
