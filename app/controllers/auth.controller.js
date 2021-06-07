const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({username : req.body.username})
            .populate("role", "-__v")
            if (!user) {
                return res.send({ message : " User not found "});
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const token = jwt.sign({id: user.id}, config.secret,{
                expiresIn: 86400
            });

            res.send({
                id: user._id,
                username: user.username,
                role: user.role,
                accessToken: token
            });

    } catch (err) {
        return res.send({message: "Error"});
    }
}