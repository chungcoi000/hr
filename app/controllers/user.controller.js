const db = require("../models");
const User = db.user;
const Role = db.role;

const bcrypt = require("bcryptjs");

//Staff
//Trainer Management
exports.getTrainerAccount = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff") {
            const role = await Role.findOne({name: "trainer"});
            if (role) {
                const user = await User.find({role: role._id}).select("-password");
                return res.send(user);
            }
        }
        if (req.session && req.session.user.role === "trainer") {
            const trainer = await User.findOne({id: req.session.user._id}).select("-username -password");
            return res.render("trainer/trainerProfile", {trainer : trainer});
        }
        res.render("/login");
    } catch (err) {
        return res.send({message: "Error"});
    }
};

//Trainee Management
exports.getTraineeAccount = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff") {
            const role = await Role.findOne({name: "trainee"});
            if (role) {
                const user = await User.find({role: role._id});
                return res.render("staff/traineeList", {user: user});
            }
        }
        if (req.session && req.session.user.role === "trainee") {
            const trainee = await User.findOne({id: req.session.user._id}).select("-username -password");
            return res.render("trainee/traineeProfile",{trainee: trainee});
        }
        res.redirect("/login");

    } catch (err) {
        console.log(err);
        res.send({message: "Error"});
    }
};

exports.createTraineeAccount = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff") {
            const user = new User({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8),
                name: req.body.name,
                dob: req.body.dob,
                email: req.body.email,
                education: req.body.education,
                bio: req.body.bio
            });

            const username = await User.findOne({username: req.body.username});
            if (username) {
                return res.send({message: "Username is already in used"})
            }

            const role = await Role.findOne({name: req.body.role});
            if (!role) {
                return res.send({message: "Role does not exist. "});
            }

            if (role.name === "trainee") {
                user.role = role._id;
                await user.save();
                return res.send({message: "Add successfully! "});
            }

            res.send({message: "Can not add this account"});
        } else {
            res.send({message: "Only for staff "});
        }
    } catch (err) {
        return res.send({message: "Error"});
    }
};

exports.deleteInformation = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff") {
            await User.deleteOne({_id: req.body.id});
            res.send({message: "Delete account successfully"});
        } else {
            res.send({message: "Only for staff "});
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
            {name: name, dob: dob, email: email, education: education, bio: bio}
        );
        res.send({message: "Update successfully"});
    } catch (err) {
        res.send({message: err});
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.body.id});
        const currentPassword = req.body.password;
        let newPassword = req.body.new_password;

        const comparePassword = await bcrypt.compareSync(
            currentPassword,
            user.password,
        );

        console.log(comparePassword);
        if (comparePassword === false)
        {
            return res.send({ message : "Password doesn't match"});
        }

        newPassword = bcrypt.hashSync(newPassword, 8);
        await user.updateOne({password: newPassword});
        return res.send({message: "Password has been updated"});
    } catch (err) {
        return res.send({message: "Error "});
    }
};

exports.searchUser = async (req, res) => {
    try {
        if (req.session && req.session.role.name === "staff")
        {
            let query = req.body.query;

            const trainee = await User.find(
                {
                    $or: [
                        {name: {$regex: query, $options: 'i'}},
                        {bio: {$regex: query, $options: 'i'}},
                        {education: {$regex: query, $option: 'i'}}
                    ]
                })

                .populate({path: "course", model: "Course", select: "name description"});

            if (trainee.length === 0) {
                return res.send({message: "Can't find anything"});
            }

            res.send(trainee);
        }
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});

    }
};


