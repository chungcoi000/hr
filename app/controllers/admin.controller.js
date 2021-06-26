const db = require("../models");
const User = db.user;
const Role = db.role;

const bcrypt = require("bcryptjs");

exports.getAccount = async (req, res) => {
    try {
        const user = await User.find({}).select("username role");
        res.send(user);
    } catch (err) {
        res.send({ message : "Error"})
    }
}

exports.getAccountById = async (req, res) => {
    try {
        const user = await User.find({_id: req.body.id}).select("username password role");
        return res.send(user);
    } catch (err) {
        return res.send({ message : "Error "});
    }
}

exports.createAccount = async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
        });

        const username = await User.findOne({username : req.body.username});
        if (username) {
            return res.send({ message : "Username is already in used"})
        }

        const role = await Role.findOne({name: req.body.role});
        if (!role) {
            return res.send({message: "Role does not exist. "});
        }

        if (role.name === "trainer" || role.name === "staff")
        {
            user.role = role._id;
            await user.save();
            return res.send({message: "Add successfully! "});
        }

        return res.send({ message: "Can not create this account"});

    } catch (err) {
        return res.send({message: "Error"});
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await User.deleteOne({_id: req.body.id});
        res.send({ message : "Delete account successfully"});
    } catch (err) {
        return res.send({message: "Can't delete account"});
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const role = await Role.findOne({name: req.body.role});
        await User.updateMany(
            {_id: req.body.id},
            {username: username, password: password, role: role._id}
        );
        res.send({message : "Update successfully"});
    } catch (err) {
        return res.send({message: "Error"});
    }
};
