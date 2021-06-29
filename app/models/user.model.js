const mongoose = require('mongoose');

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        password: String,
        name: String,
        dob: String,
        email: String,
        education: String,
        telephone: String,
        toeicscore: String,
        programlanguage: String,
        bio: String,
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        },
        courseAssign: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }]
    })
);

module.exports = User;