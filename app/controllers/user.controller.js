const db = require("../models");
const User = db.user;
const Role = db.role;

const bcrypt = require("bcryptjs");

//Staff
//Trainer Management

//Trainee Management
exports.getTraineeAccount = async (req, res) => {
    try {
        const role = await Role.findOne({name: "trainee"});
        if (role)
        {
            const user = await User.find({role : role._id});
            return res.send(user);
        }
        res.send("Can't find user")
    } catch (err) {
        console.log(err);
        res.send({ message : "Error"})
    }
}

exports.createTraineeAccount = async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            name: req.body.name,
            dob: req.body.dob,
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
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});
    }
};

exports.deleteTraineeInformation = async (req, res) => {
    try {
        await User.deleteOne({_id: req.body.id});
        res.send({ message : "Delete account successfully"});
    } catch (err) {
        res.send({message: err});
    }
};

exports.updateTraineeInformation = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const name = req.body.name;
        const dob = req.body.dob;
        const education = req.body.education;
        const bio = req.body.bio;
        await User.updateMany(
            {_id: req.body.id},
            {username: username, password: password, name: name,
                    dob: dob, education: education, bio: bio}
        );
        res.send({message : "Update successfully"});
    } catch (err) {
        res.send({message: err});
    }
};

//Trainer

//Trainee
