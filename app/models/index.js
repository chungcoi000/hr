const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.admin = require("./admin.model");
db.role = require("./role.model");
db.course = require("./course.model");
db.category = require("./category.model");

db.ROLES = ["admin", "staff", "trainer", "trainee"];

module.exports = db;