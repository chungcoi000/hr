const db = require("../models");
const User = db.user;
const Course = db.course;
const Category = db.category;

//Course Management
exports.getCourse = async (req, res) => {
    try {
        const course = await Course.find({}).lean();
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
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.find({_id: req.body.id});
        res.send(course);
    } catch (err) {
        res.send({message: "Error"});
    }
}

exports.addCourse = async (req, res) => {
    try {
        const course = new Course({
            name: req.body.name,
            description: req.body.description
        });

        const courseName = await Course.findOne({name: req.body.name});
        if (courseName) {
            return res.send({message: "Course is already in database"});
        }

        const category = await Category.findOne({name: req.body.category});
        if (!category) {
            return res.send({message: "Category doesn't exist"});
        }

        course.category = category._id;
        await course.save();

        res.send({message: "Add course successfully"});

    } catch (err) {
        res.send({message: err});
    }
}

exports.updateCourse = async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const category = await Category.findOne({name: req.body.category});
        if (category) {
            await Course.updateMany(
                {_id: req.body.id},
                {name: name, description: description, category: category._id}
            );
            return res.send({message: "Update course successfully!"});
        }
        return res.send({message: "Category doesn't existed"});
    } catch (err) {
        res.send({message: err});
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id});
        res.send({message: "Delete course successfully!"});
    } catch (err) {
        res.send({message: "Can delete course"});
    }
};

exports.findCourse = async (req, res) => {
    try {

    } catch (err) {
        return res.send({message: "Error"})
    }
};
//Course Category

exports.getCourseFromCategory = async (req, res) => {
    try {
        const category = await Category.findOne();
        console.log(category);
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
            console.log(user);
            if (!courseId) {
                res.send({message: "Must provide course id"});
            }

            if (!await Course.findOne({_id: courseId})) {
                return res.send({message: "Can  not find course "});
            }
            await User.findOne({_id: user}).catch(err => {
                res.send({message: err})
            });
            await User.updateOne({
                _id: user
            }, {
                $push: {
                    courseAssign: courseId
                }
            })
            res.send({message: "Add Course to User successfully"});
        } else {
            res.send({message: "No session provided"});
        }
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});
    }
};

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
        const user = req.session.user;
        if (user) {
            const course = await User.findOne({_id: user.id})
                .populate({path: 'courseAssign', model: "Course", select: "name description category"});
            return res.send(course);
        }
        return res.send({message: "No session provided"})
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});
    }
};

exports.searchCourse = async (req, res) => {
    try {
        let query = req.body.query;

        const course = await Course.find({name: {$regex: query, $options: 'i'}})
            .populate({path: "category", model: "Category", select: "name description"});

        if (course.length === 0) {
            return res.send({message: "Can't find anything"});
        }

        res.send(course);
    } catch (err) {
        console.log(err);
        return res.send({message: "Error"});

    }
};