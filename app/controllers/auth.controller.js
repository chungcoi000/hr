const db = require("../models");
const User = db.user;

const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
            .populate("role", "-__v")
            if (!user) {
                return res.render("auth/login",{
                    error: true,
                    message: "User doesn't exist"
                });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.render("auth/login", {
                    error: true,
                    message: "Incorrect password"
                });
            }
            req.session.user = {
                id: user._id,
                username: user.username,
                role: user.role.name,
            };

            res.redirect("/home");

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
        return res.redirect("/login");
    } catch (err) {
        return res.send({ message : err});
    }
}