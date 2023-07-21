// Imports
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Création d'un nouvel utilisateur
 * @param req
 * @param res
 */
exports.userSignUp = (req, res) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user
                .save()
                .then(() => res.status(201).json({ message: "L'utilisateur a bien été créé" }))
                .catch((error) => res.status(400).json(`Erreur : ${error}`));
        })
        .catch((error) => res.status(500).json(`Erreur : ${error}`));
};

/**
 * Connexion d'un utilisateur
 * @param req
 * @param res
 */
exports.userLogin = (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: "L'utilisateur n'a pas été trouvé dans la base de données" });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ error: "Le mot de passe est incorrect" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
                            expiresIn: "24h",
                        }),
                    });
                })
                .catch((error) => res.status(500).json(`Erreur : ${error}`));
        })
        .catch((error) => res.status(500).json(`Erreur : ${error}`));
};
