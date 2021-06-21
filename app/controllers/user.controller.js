const db = require("../models");
const User = db.user;
const Role = db.role;

const bcrypt = require("bcryptjs");

//Staff
//Trainer Management
exports.getTrainerAccount = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff")
        {
            const role = await Role.findOne({name : "trainer"});
            if (role) {
                const user = await User.find({role : role._id}).select("-password -username");
                return res.send(user);
            }
        }
        else {
            res.send({message : "Only for staff "});
        }
    } catch (err) {
        return res.send({ message : "Error"});
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const user = await User.find({_id: req.body.id});
        return res.send(user);
    } catch (err) {
        return res.send({ message : "Error "});
    }
};

//Trainee Management
exports.getTraineeAccount = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff")
        {
            const role = await Role.findOne({name: "trainee"});
            if (role)
            {
                const user = await User.find({role : role._id}).select("-password -username");
                return res.send(user);
            }
            res.send({message : "Can't find user"});
        }
        else {
            res.send({message : "Only for staff "});
        }
    } catch (err) {
        console.log(err);
        res.send({ message : "Error"});
    }
};

exports.createTraineeAccount = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff")
        {
            const user = new User({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8),
                name: req.body.name,
                dob: req.body.dob,
                email: req.body.email,
                education: req.body.education,
                bio : req.body.bio
            });

            const username = await User.findOne({username : req.body.username});
            if (username) {
                return res.send({ message : "Username is already in used"})
            }

            const role = await Role.findOne({name: req.body.role});
            if (!role) {
                return res.send({message: "Role does not exist. "});
            }

            if (role.name === "trainee")
            {
                user.role = role._id;
                await user.save();
                return res.send({message: "Add successfully! "});
            }

            res.send({ message: "Can not add this account"});
        }
        else {
            res.send({message : "Only for staff "});
        }
    } catch (err) {
        return res.send({message: "Error"});
    }
};

exports.deleteInformation = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff")
        {
            await User.deleteOne({_id: req.body.id});
            res.send({ message : "Delete account successfully"});
        }
        else {
            res.send({message : "Only for staff "});
        }
    } catch (err) {
        return res.send({message: err});
    }
};

exports.updateInformation = async (req, res) => {
    try {
        const name = req.body.name;
        const dob = req.body.dob;
        const email = req.body.email;
        const education = req.body.education;
        const bio = req.body.bio;

        if (!req.body.id) {
            return res.send({message: "Id not found"});
        }

        await User.updateMany(
            {_id: req.body.id},
            { name: name, dob: dob, email: email, education: education, bio: bio}
        );
        res.send({message : "Update successfully"});
    } catch (err) {
        res.send({message: err});
    }
};

exports.updatePassword = async (req, res) => {
    try {
        await User.updateOne({_id : req.body.id},{password : req.body.password});
        return res.send({message : "Password has been updated"});
    } catch (err) {
        return res.send({ message : "Error "});
    }
};

