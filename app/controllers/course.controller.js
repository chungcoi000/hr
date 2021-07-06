const db = require("../models");
const Role = db.role;
const User = db.user;
const Course = db.course;
const Category = db.category;

//Course Management
exports.getCourse = async (req, res) => {
    try {
        const category = await Category.find({});
        const course = await Course.find({category})
            .lean().populate("category", "name", "Category");
        if (req.session && req.session.user.role === "staff") {
            return res.render("staff/manageCourse", {course: course});
        }
        if (req.session && req.session.user.role === "trainee") {
            return res.render("trainee/traineeCourses", {course: course});
        }
    } catch (err) {
        res.render("error");
    }
};

exports.addCourse = async (req, res) => {
    try {
        const course = {
            name: req.body.name,
            description: req.body.description
        };

        const courseName = await Course.findOne({name: req.body.name});
        if (courseName) {
            return res.render("staff/addCourse", {
                error: true,
                message: "Course is already in database!"
            });
        }

        const category = await Category.findOne({name: req.body.category});
        if (!category) {
            return res.render("staff/addCourse", {
                error: true,
                message: "Category doesn't exist!"
            });
        }

        course.category = category._id;
        await Course.create(course);
        return res.redirect("/admin/getAccount");

    } catch (err) {
        res.send({message: err});
    }
}

exports.getAddCourse = async (req, res) => {
    try {
        const categories = await Category.find({}).lean();
        res.render("staff/addCourse", {categories: categories})
    } catch (err) {
        return res.render("error");
    }
}


exports.updateCourse = async (req, res) => {
    try {
        const course_id = req.body.course_id;
        const name = req.body.name;
        const description = req.body.description;
        const category = await Category.findOne({name: req.body.category});

        await Course.updateOne(
            {_id: course_id},
            {name: name, description: description, category: category._id}
        );
        res.redirect("/api/getCourse");

    } catch (err) {
        res.render("error");
    }
};

exports.getUpdateCourse = async (req, res) => {
    try {
        let id = req.query.course_id;
        const course = await Course.findOne({_id: id}).lean();
        const categories = await Category.find({}).lean();
        return res.render("staff/courseUpdate", {
            course: course,
            categories: categories
        })
    } catch (err) {
        return res.send({message: "Error "});
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const deleteId = req.body.delete_id;
        await Course.deleteOne({_id: deleteId});
        res.render("staff/manageCourse");
    } catch (err) {
        res.render("error");
    }
};

//Course Category

exports.getCourseFromCategory = async (req, res) => {
    try {
        const category = await Category.findOne();
        if (category) {
            const course = await Course.find({category: category._id});
            return res.send(course);
        }
    } catch (err) {
        res.render("error");
    }
};

// Add user to course

exports.addUserToCourse = async (req, res) => {
    try {
        if (req.session && req.session.user.role === "staff") {
            const trainer = req.body.trainer_id;
            const trainee = req.body.trainee_id;
            const courseId = req.body.course_id;
            if (!courseId) {
                res.send({message: "Must provide course id"});
            }

            if (!await Course.findOne({_id: courseId})) {
                return res.render("staff/addUserToCourse");
            }
            trainee.push(trainer)

            await User.updateMany({
                _id: {$in: trainee}
            }, {
                $push: {
                    courseAssign: courseId
                }
            })
            res.redirect("/home");
        } else {
            res.redirect("/login");
        }
    } catch (err) {
        console.log(err);
        return res.render("error");
    }
};

exports.getAddUserToCourse = async (req, res) => {
    try {
        const trainee = await Role.find({name: "trainee"});
        const trainer = await Role.find({name: "trainer"});
        const user1 = await User.find({role: trainer}).lean();
        const user2 = await User.find({role: trainee}).lean();
        const course = await Course.find({}).lean();

        return res.render("staff/addUserToCourse", {
            trainer: user1,
            trainee: user2,
            course: course
        });

    } catch (err) {
        res.render("error");
    }
}

exports.deleteUserFromCourse = async (req, res) => {
    try {
        const userSession = req.session
        if (userSession && userSession.user.role === "staff") {
            const user = req.query.user_id;
            const courseId = req.query.course_id;
            console.log(user, courseId)
            if (!courseId) {
                res.redirect("/api/viewCourseAssigned");
            }

            if (!await Course.findOne({_id: courseId})) {
                return res.redirect("/api/viewCourseAssigned");
            }

            const role = await User.findOne({_id: user}).populate("role","name","Role")
                .catch(err => {
                    res.send({message: err})
                });
            await User.updateOne({
                _id: user
            }, {
                $pull: {
                    courseAssign: courseId
                }
            })
            if (role.role.name === "trainer") {
                return res.render("staff/trainerList");
            }
            if (role.role.name === "trainee") {
                return res.render("staff/traineeList");
            }
        } else {
            res.redirect("/login");
        }
    } catch (err) {
        console.log(err);
        return res.render("error");
    }
};

exports.viewCourseAssigned = async (req, res) => {
    try {
        const session = req.session.user;
        if (session.role === "trainer") {
            const user = await User.findOne({_id: session.id})
                .populate(
                    {
                        path: 'courseAssign',
                        model: "Course",
                        select: "name description category",
                        populate: {
                            path: 'category',
                            model: "Category",
                            select: "name"
                        }
                    },
                ).lean();
            return res.render("trainer/trainerCourseAssigned", {user: user});
        }
        if (session.role === "trainee") {
            const user = await User.findOne({_id: session.id})
                .populate({
                    path: 'courseAssign',
                    model: "Course",
                    select: "name description category",
                    populate: {
                        path: 'category',
                        model: "Category",
                        select: "name"
                    }
                }).lean();
            return res.render("trainee/traineeCourseAssigned", {user: user});
        }
        if (session.role === "staff") {
            const user_id = req.query.user_id;
            const user = await User.findOne({_id: user_id})
                .populate({
                    path: 'courseAssign',
                    model: "Course",
                    select: "name description category",
                    populate: {
                        path: 'category',
                        model: "Category",
                        select: "name"
                    }
                }).lean();
            return res.render("staff/removeCourse", {
                userId: user._id,
                course: user.courseAssign
            });
        }
        return res.redirect("/login");
    } catch (err) {
        console.log(err);
        return res.render("error");
    }
};

exports.searchCourse = async (req, res) => {
    try {
        let query = req.body.query;

        let filter = {
            $or: [
                {name: {$regex: query, $options: 'i'}},
                {description: {$regex: query, $options: 'i'}}
            ]
        }

        if (!query) {
            filter = {};
        }

        const course = await Course.find(filter)
            .populate({
                path: "category",
                model: "Category",
                select: "name description"
            }).lean();

        if (course.length === 0) {
            return res.render("staff/manageCourse", {
                course: course,
                error: true,
                message: "Can't find in db"
            });
        }

        res.render("staff/manageCourse", {course: course});
    } catch (err) {
        console.log(err);
        return res.render("error");

    }
};