const db = require("../models");
const User = db.user;

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

            req.session.user = {
                id: user._id,
                username: user.username,
                role: user.role.name,
            };

            res.send({message : "Login successfully"});

    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});
    }
}

exports.logout = async (req, res) => {
    try {
        if (req.session.user) {
            req.session.destroy();
        }
        return res.send("Logout successfully.");
    } catch (err) {
        return res.send({ message : err});
    }
}