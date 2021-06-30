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
                const user = await User.find({role: role._id}).select("-password").lean();
                return res.render("staff/trainerList", {user: user});
            }
        }
        if (req.session && req.session.user.role === "trainer") {
            const trainer = await User.findOne({_id: req.session.user.id}).lean();
            return res.render("trainer/trainerProfile", {trainer: trainer});
        }
        res.redirect("/login");
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
                const user = await User.find({role: role._id}).lean();
                return res.render("staff/traineeList", {user: user});
            }
        }
        if (req.session && req.session.user.role === "trainee") {
            const trainee = await User.findOne({_id: req.session.user.id}).lean();
            return res.render("trainee/traineeProfile", {
                trainee: trainee
            });
        }
        res.redirect("/login");

    } catch (err) {
        res.send({message: "Error"});
    }
};

exports.createTraineeAccount = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff") {
            const user = {
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8),
            };

            const username = await User.findOne({username: req.body.username});
            if (username) {
                return res.render("staff/createTrainee", {
                    error: true,
                    message: "Username is already in used"
                })
            }

            const role = await Role.findOne({name: "trainee"});
            if (!role) {
                return res.render("staff/createTrainee", {
                    error: true,
                    message: "Role doesn't exist!"
                });
            }

            user.role = role._id;
            await User.create(user);
            return res.redirect("/api/getTrainee");

        } else {
            res.redirect("/api/getTrainee");
        }
    } catch (err) {
        return res.send({message: "Error"});
    }
};

exports.getCreateAccount = async (req, res) => {
    try {
        const role = await Role.find({name: "trainee"}).lean();
        res.render("staff/createTrainee", {role: role});
    } catch (err) {
        return res.send({message: "Error"});
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff") {
            const deleteId = req.body.delete_id;
            await User.deleteOne({_id: deleteId});
            res.send({message: "Delete account successfully"});
        } else {
            res.render("staff/traineeList");
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
        const telephone = req.body.telephone;
        const education = req.body.education;
        const toeicscore = req.body.toeicscore;
        const programlanguage = req.body.programlanguage;
        const bio = req.body.bio;

        if (!req.body.id) {
            return res.send({message: "Id not found"});
        }

        await User.updateOne(
            {_id: req.body.id},
            {
                name: name, dob: dob, email: email, telephone: telephone, education: education,
                toeicscore: toeicscore, programlanguage: programlanguage, bio: bio
            }
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

        if (comparePassword === false) {
            return res.send({message: "Password doesn't match"});
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
        if (req.session && req.session.role.name === "staff") {
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


