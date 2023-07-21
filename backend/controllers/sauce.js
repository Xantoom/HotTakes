// Imports
const fs = require("fs");
const Sauce = require("../models/sauce");

/**
 * Récupération de toutes les sauces
 * @param req
 * @param res
 */
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

/**
 * Création d'une nouvelle sauce
 * @param req
 * @param res
 */
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: "Nouvelle sauce ajoutée" }))
        .catch((error) => res.status(400).json({ error }));
};

/**
 * Récupération d'une sauce grâce à son ID
 * @param req
 * @param res
 */
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

/**
 * Suppression d'une sauce grâce à son ID
 * @param req
 * @param res
 */
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(401).json({ error: "Requête non autorisée" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Sauce supprimée" }))
                        .catch((error) => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => res.status(404).json({ error }));
};

/**
 * Modification d'une sauce grâce à son ID
 * @param req
 * @param res
 */
exports.updateSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(401).json({ error: "Requête non autorisée" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                const sauceObject = req.file ? {
                        ...fs.unlink(`images/${filename}`, () => {}),
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                    } : { ...req.body };
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "La sauce a bien été modifiée" }))
                    .catch((error) => res.status(400).json(`Erreur : ${error}`));
            }
        })
        .catch((error) => res.status(404).json({ error }));
};

/**
 * Gestion des likes/dislikes
 * @param req
 * @param res
 */
exports.likeSauce = (req, res) => {
    switch (req.body.like) {
        // Dans le cas d'un like
        case 1:
            Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
                .then(() => res.status(200).json({ message: "Vous avez aimé cette sauce !" }))
                .catch((error) => res.status(400).json(`Erreur : ${error}`));
            break;
        // Dans le cas d'un dislike
        case -1:
            Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } })
                .then(() => res.status(200).json({ message: "Vous n'aimez pas cette sauce !" }))
                .catch((error) => res.status(400).json(`Erreur : ${error}`));
            break;
        // Dans le cas d'un annulation de like/dislike
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                            .then(() => res.status(200).json({ message: "Votre J'aime a bien été retiré !" }))
                            .catch((error) => res.status(400).json(`Erreur : ${error}`));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $pull: { usersDisliked: req.body.userId },
                                $inc: { dislikes: -1 },
                            }
                        )
                            .then(() => res.status(200).json({ message: "Votre Je n'aime pas a bien été retiré" }))
                            .catch((error) => res.status(400).json(`Erreur : ${error}`));
                    }
                })
                .catch((error) => res.status(404).json({ error }));
            break;
    }
};
