const db = require("../models");
const User = db.user;
const Role = db.role;

const bcrypt = require("bcryptjs");

exports.getAccount = async (req, res) => {
    try {
        const role = await Role.find({name: {$in: ["staff", "trainer"]}});

        const user = await User.find({role}).select("username")
            .lean().populate("role", "name", "Role");
        console.log(user[0]);
        return res.render('admin/UserList', {user: user});

    } catch (err) {
        console.log(err)
        res.send({message: "Error"})
    }
}

exports.getAccountById = async (req, res) => {
    try {
        const user = await User.find({_id: req.body.id}).select("username password role");
        return res.send(user);
    } catch (err) {
        return res.send({message: "Error "});
    }
}
exports.getUpdateAccount = async (req, res) => {
    try {
        const roles = await Role.find({name: {$in: ["staff", "trainer"]}}).lean();
        res.render("admin/editUser", {roles: roles})
    } catch (e) {
        return res.send({message: e})
    }
}

exports.createAccount = async (req, res) => {
    try {
        const user = {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
        };

        const username = await User.findOne({username: req.body.username});
        if (username) {
            return res.render("admin/addUser", {
                error: true,
                message: "Username is already existed!"
            });
        }

        const role = await Role.findOne({name: {$in: ["staff", "trainer"]}});
        if (!role) {
            return res.render("admin/addUser", {
                error: true,
                message: "Role doesn't exist!"
            });
        }

        user.role = role._id;
        await User.create(user);
        return res.redirect("/admin/getAccount");
    } catch (err) {
        return res.send({message: "Error"});
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const deleteId = req.body.delete_id;
        console.log(deleteId)
        await User.deleteOne({_id: deleteId});
        res.send({message: "Delete successfully"});
    } catch (err) {
        return res.send({message: "Can't delete account"});
    }
};

exports.getCreateAccount = async (req, res) => {
    try {
        const roles = await Role.find({name: {$in: ["staff", "trainer"]}}).lean();
        res.render("admin/addUser", {roles: roles})
    } catch (e) {
        res.send({message: e})
    }
}

exports.updateAccount = async (req, res) => {
    try {
        const username = req.body.username;
        let password = req.body.new_password;
        password = bcrypt.hashSync(password, 8);
        const role = await Role.findOne({name: {$in: ["staff", "trainer"]}});
        await User.updateMany(
            {_id: req.body.id},
            {username: username, password: password, role: role._id}
        );
        res.send({message: "Update successfully"});
    } catch (err) {
        return res.send({message: "Error"});
    }
};


