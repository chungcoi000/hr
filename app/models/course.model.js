const mongoose = require('mongoose');

const Course = mongoose.model(
    "Course",
    new mongoose.Schema({
        name: String,
        description: String,
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    })
);

module.exports = Course;