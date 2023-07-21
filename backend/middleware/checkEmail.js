// On importe le package
const checkEmail = require("email-validator");

module.exports = (req, res, next) => {
    if (!checkEmail.validate(req.body.email))
        res.status(401).json({ error: "L'email n'est pas valide" });
    else
        next();
};
