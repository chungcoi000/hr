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
        res.send({message: "Error"});
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
        return res.send({message: "Error"});
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
        console.log(category)
        res.redirect("/api/getCourse");

    } catch (err) {
        res.send({message: "Error"});
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
        res.send({message: "Error"});
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
        res.send({message: "Error"});
    }
};

// Add user to course

exports.addUserToCourse = async (req, res) => {
    try {
        const userSession = req.session
        if (userSession && userSession.user.role === "staff") {
            const user = req.body.user_id;
            const courseId = req.body.course_id;
            if (!courseId) {
                res.send({message: "Must provide course id"});
            }

            if (!await Course.findOne({_id: courseId})) {
                return res.render("/staff/addCourseToUser");
            }
            await User.findOne({_id: user})
                .populate({
                    path: "role",
                    model: "Role",
                    select: "name"
                }).lean()
                .catch(err => {
                res.send({message: err})
            });

            await User.updateOne({
                _id: user
            }, {
                $push: {
                    courseAssign: courseId
                }
            })
            res.render("staff/manageCourse");
        } else {
            res.redirect("/login");
        }
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});
    }
};

exports.getAddUserToCourse = async (req, res) => {
    try {
        const role = await Role.find({name: {$in: ["staff", "trainer"]}});

        const user = await User.find({role: role}).lean();
        const course = await Course.find({}).lean();

        return res.render("staff/addUserToCourse", {
            user: user,
            course: course
        });

    } catch (err) {
        res.send(err)
    }
}

exports.deleteUserFromCourse = async (req, res) => {
    try {
        const userSession = req.session
        if (userSession && userSession.user.role === "staff") {
            const user = req.body.user_id;
            const courseId = req.body.course_id;
            if (!courseId) {
                res.send({message: "Must provide course id"});
            }

            if (!await Course.findOne({_id: courseId})) {
                return res.send({message: "Can not find user "});
            }

            await User.findOne({_id: user}).catch(err => {
                res.send({message: err})
            });
            await User.updateOne({
                _id: user
            }, {
                $pull: {
                    courseAssign: courseId
                }
            })
            res.send({message: "Delete User from Course successfully"});
        } else {
            res.send({message: "No session provided"});
        }
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});
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
        return res.redirect("/login");
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});
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
            return res.send({message: "Can't find anything"});
        }

        res.render("staff/manageCourse", {course: course});
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});

    }
};