const config = require("../config/db.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const bcrypt = require("bcryptjs");

exports.createAccount = async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
        });

        const role = await Role.findOne({name: req.body.role});
        if (!role) {
            return res.send({message: "Role does not exist. "});
        }
        user.role = role._id;
        await user.save();

        res.send({message: "Add successfully! "})
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});
    }
};
