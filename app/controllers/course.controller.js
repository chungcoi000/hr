const db = require("../models");
const User = db.user;
const Role = db.role;
const Course = db.course;
const Category = db.category;

//Course Management
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

        const cate = await Category.findOne({name: req.body.category});
        if (!cate) {
            return res.send({ message : "Category doesn't exist"});
        }
        course.cate = course._id;
        await course.save();

        res.send({ message : "Add course successfully"});

    } catch (err) {
        res.send({message: err});
    }
}

exports.updateCourse = async (req, res) => {
    try {

    } catch (err) {
        res.send({message: err});
    }
}

exports.deleteCourse = async (req, res) => {
    try {

    } catch (err) {
        res.send({ message : err });
    }
}
//Course Category