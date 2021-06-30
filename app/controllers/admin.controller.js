const db = require("../models");
const User = db.user;
const Role = db.role;

const bcrypt = require("bcryptjs");

exports.getAccount = async (req, res) => {
    try {
        const role = await Role.find({name: {$in: ["staff", "trainer"]}});

        const user = await User.find({role}).select("username")
            .lean().populate("role", "name", "Role");
        return res.render('admin/userList', {user: user});

    } catch (err) {
        console.log(err)
        res.send({message: "Error"})
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

        const role = await Role.findOne({name: req.body.role});
        console.log(req.body.role)
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

exports.getCreateAccount = async (req, res) => {
    try {
        const roles = await Role.find({name: {$in: ["staff", "trainer"]}}).lean();
        res.render("admin/addUser", {roles: roles})
    } catch (e) {
        res.send({message: e})
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        const deleteId = req.body.delete_id;
        console.log(deleteId)
        await User.deleteOne({_id: deleteId});
        res.render("admin/userList");
    } catch (err) {
        return res.send({message: "Can't delete account"});
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const username = req.body.username;
        let password = req.body.new_password;
        password = await bcrypt.hashSync(password, 8);
        const role = await Role.findOne({name: req.body.role});
        console.log(user_id);
        await User.updateOne(
            {_id: user_id},
            {username: username, password: password, role: role._id}
        );
        res.redirect("/admin/getAccount");
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});
    }
};

exports.getUpdateAccount = async (req, res) => {
    try {
        let id = req.query.user_id;
        const user = await User.findOne({_id: id}).lean();
        return res.render("admin/editUser", {
            user: user,
            roles: ["staff", "trainer"]
        })
    } catch (err) {
        return res.send({message: "Error "});
    }
}

