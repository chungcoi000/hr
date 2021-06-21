const db = require("../models");
const User = db.user;
const Role = db.role;
const Course = db.course;
const Category = db.category;

//Course Management
exports.getCourse = async (req, res) => {
    try {
        const course = await Course.find();
        res.send(course);
    } catch (err) {
        res.send({ message : "Error"});
    }
};
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.find({_id : req.body.id});
        res.send(course);
    } catch (err) {
        res.send({ message : "Error"});
    }
}

exports.addCourse = async (req, res) => {
    try {
        const course = new Course({
            name : req.body.name,
            description : req.body.description
        });

        const courseName = await Course.findOne({name : req.body.name});
        if (courseName) {
            return res.send({ message : "Course is already in database"});
        }

        const category = await Category.findOne({name: req.body.category});
        if (!category) {
            return res.send({ message : "Category doesn't exist"});
        }

        course.category = category._id;
        await course.save();

        res.send({ message : "Add course successfully"});

    } catch (err) {
        res.send({message: err});
    }
}

exports.updateCourse = async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const category = await Category.findOne({name : req.body.category});
        if (category) {
            await Course.updateMany(
                {_id: req.body.id},
                {name: name, description: description, category: category._id}
            );
            return res.send({message: "Update course successfully!"});
        }
        return res.send({message : "Category doesn't existed"});
    } catch (err) {
        res.send({message: err});
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id});
        res.send({message: "Delete course successfully!"});
    } catch (err) {
        res.send({ message: "Can delete course" });
    }
};

exports.findCourse = async (req, res) => {
    try{

    } catch (err) {
        return res.send({ message : "Error"})
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
        res.send({message : "Error"});
    }
};

// Add user to course

exports.addUserToCourse = async (req, res) => {
    try {
        const userSession = req.session
        if (userSession && userSession.user.role === "staff") {
            const user = req.body.user_id;
            const courseId = req.body.course_id;
            if (!user) {
                res.send({message : "Must provide user id"});
            }

            if (! await User.findOne({_id: user})) {
                return res.send({message: "Can  not find user "});
            }

            await Course.findOne({_id : courseId }).catch(err => {res.send({message : err})});
            await Course.updateOne({
                _id: courseId
            },{
                $push: {
                    participants: user
                }
            })
            res.send({message : "Add User to Course successfully"});
        }
        else {
            res.send({message : "No session provided" });
        }
    } catch (err) {
        console.log(err);
        return res.send({ message: "Error"});
    }
};

exports.deleteUserFromCourse = async (req, res) => {
    try {
        const userSession = req.session
        if (userSession && userSession.user.role === "staff") {
            const user = req.body.user_id;
            const courseId = req.body.course_id;
            if (!user) {
                res.send({message : "Must provide user id"});
            }

            if (! await User.findOne({_id: user})) {
                return res.send({message: "Can not find user "});
            }

            await Course.findOne({_id : courseId }).catch(err => {res.send({message : err})});
            await Course.updateOne({
                _id: courseId
            },{
                $pull: {
                    participants: user
                }
            })
            res.send({message : "Delete User from Course successfully"});
        }
        else {
            res.send({message : "No session provided" });
        }
    } catch (err) {
        console.log(err);
        return res.send({ message: "Error"});
    }
};

exports.viewCourseAssigned = async (req, res) => {
    try {

    } catch (err) {
        console.log(err);
        return res.send({ message: "Error"});
    }
}