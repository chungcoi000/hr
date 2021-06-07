const mongoose = require('mongoose');

const Admin = mongoose.model(
    "Admin",
    new mongoose.Schema({
        username: String,
        password: String,
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    })
);

module.exports = Admin;