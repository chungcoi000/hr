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
        bio: String,
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    })
);

module.exports = User;