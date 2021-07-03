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
            let query = req.query.query;

            let filter = {
                role: role._id,
                $or: [
                    {name: {$regex: query, $options: 'i'}},
                    {email: {$regex: query, $options: 'i'}},
                    {bio: {$regex: query, $options: 'i'}}
                ]
            }

            if (!query) {
                filter = {role: role._id};
            }
            if (role) {
                const user = await User.find(filter).populate({
                    path: 'courseAssign',
                    model: "Course",
                    select: "name description category"
                }).lean();
                return res.render("staff/trainerList", {user: user});
            }
        }
        if (req.session && req.session.user.role === "trainer") {
            const user = await User.findOne({_id: req.session.user.id}).lean();
            return res.render("trainer/trainerProfile", {user: user});
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
            let query = req.query.query;
            console.log("query", query);

            let filter = {
                role: role._id,
                $or: [
                    {name: {$regex: query, $options: 'i'}},
                    {email: {$regex: query, $options: 'i'}},
                    {bio: {$regex: query, $options: 'i'}}
                ]
            }

            if (!query) {
                filter = {role: role._id};
            }
            if (role) {
                const user = await User.find(filter).populate({
                    path: 'courseAssign',
                    model: "Course",
                    select: "name description category"
                }).lean();
                return res.render("staff/traineeList", {user: user});
            }
        }
        if (req.session && req.session.user.role === "trainee") {
            const user = await User.findOne({_id: req.session.user.id}).lean();
            return res.render("trainee/traineeProfile", {
                user: user
            });
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
            const user = await User.findOne({_id: deleteId})
                .populate({
                    path: 'role',
                    model: "Role"
                })
            await User.deleteOne({_id: deleteId});
            if (user.role.name === "trainer") {
                return res.render("staff/trainerList")
            }
            if (user.role.name === "trainee") {
                return res.render("staff/traineeList")
            }
        } else {
            res.redirect("/login");
        }
    } catch (err) {
        return res.send({message: err});
    }
};

exports.updateInformation = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const name = req.body.name;
        const dob = req.body.dob;
        const email = req.body.email;
        const telephone = req.body.telephone;
        const education = req.body.education;
        const toeicscore = req.body.toeicscore;
        const programlanguage = req.body.programlanguage;
        const bio = req.body.bio;

        await User.updateOne(
            {_id: user_id},
            {
                name: name,
                dob: dob,
                email: email,
                telephone: telephone,
                education: education,
                toeicscore: toeicscore,
                programlanguage: programlanguage,
                bio: bio
            }
        );
        if (req.session.user.role === "staff") {
            const user = await User.findOne({_id: user_id}).populate(
                {
                    path: "role",
                    model: "Role"
                }
            );
            if (user.role.name === "trainer") {
                res.redirect("/api/getTrainer")
            }

            if (user.role.name === "trainee") {
                res.redirect("/api/getTrainee")
            }
        }

        if (req.session.user.role === "trainer") {
            res.redirect("/api/getTrainer")
        }
    } catch (err) {
        console.log(err);
        res.send({message: err});
    }
};

exports.getUpdateInformation = async (req, res) => {
    try {
        let id = req.query.user_id;
        const user = await User.findOne({_id: id}).populate({
            path: "role",
            model: "Role"
        }).lean();
        if (req.session.user.role === "staff") {
            if (user.role.name === "trainer") {
                res.render("staff/editTrainer", {
                    user: user
                });
            }
            if (user.role.name === "trainee") {
                res.render("staff/editTrainee", {
                    user: user
                });
            }
        }
        if (req.session.user.role === "trainer") {
            return res.render("trainer/trainerUpdateProfile", {
                user: user
            })
        }
    } catch (e) {
        return res.send({message: "Error "});
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const user = await User.findOne({_id: user_id})
            .populate("role", "name", "Role");
        const currentPassword = req.body.password;
        let newPassword = req.body.new_password;


        const comparePassword = await bcrypt.compareSync(
            currentPassword,
            user.password,
        );

        if (comparePassword === false) {
            if (user.role.name === "trainer") {
                return res.render("trainer/trainerPassword", {
                    error: true,
                    message: "Password does not match with password in database"
                });
            }

            if (user.role.name === "trainee") {
                return res.render("trainee/traineePassword", {
                    error: true,
                    message: "Password does not match with password in database"
                });
            }
        }
        newPassword = bcrypt.hashSync(newPassword, 8);
        await user.updateOne({password: newPassword});
        if (user.role.name === "trainer") {
            return res.redirect("/api/getTrainer");
        }

        if (user.role.name === "trainee") {
            return res.redirect("/api/getTrainee");
        }

    } catch (err) {
        console.log(err);
        return res.send({message: "Error "});
    }
};

exports.getUpdatePassword = async (req, res) => {
    try {
        let id = req.query.user_id;
        const user = await User.findOne({_id: id}).populate("role", "name", "Role").lean();
        if (user.role.name === "trainer") {
            return res.render("trainer/trainerPassword", {
                user: user
            })
        }

        if (user.role.name === "trainee") {
            return res.render("trainee/traineePassword", {
                user: user
            })
        }
    } catch (err) {
        return res.send({message: "Error "});
    }
}

exports.searchUser = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff") {
            let query = req.body.query;
            let filter = {
                $or: [
                    {name: {$regex: query, $options: 'i'}},
                    {email: {$regex: query, $options: 'i'}},
                    {bio: {$regex: query, $options: 'i'}}
                ]
            }

            if (!query) {
                filter = {};
            }

            const user = await User.find(filter)
                .populate([{
                        path: "courseAssign",
                        model: "Course",
                        select: "name description"
                    }, {
                        path: "role",
                        model: "Role",
                        select: "name"
                    }]
                )
                .lean();

            if (user.length === 0) {
                return res.send({message: "Can't find anything"});
            }
            if (user.role === "trainer") {
                res.render("staff/trainerList", {user: user});
            }
            if (user.role === "trainee") {
                res.render("staff/traineeList", {user: user});
            }
        }
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});

    }
};


