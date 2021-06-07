const jwt = require('jsonwebtoken');
const config = require("../config/auth.config");
const db = require("../models");
const Role = db.role;
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message : "No token provided "});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message : "Authorized! "});
        }
        req.userId = decoded.id;
        next();
    });
};

isRoles = async (req, res ,next) => {
    try {
        const user = await User.findById(req.userId);

        const roles = await Role.findOne({_id : user.roles})

        if (roles.name === "staff" || roles.name === "trainer" || roles.name === "trainee") {
            next();
        }
        res.send({ message : "Require Role Permission! "});
    } catch (err) {
        return res.send({ message : "Error" });
    }
};

const authJwt = {
    verifyToken,
    isRoles
};

module.exports = authJwt;