const authController = require('../controllers/auth.controller');

module.exports = (app) => {

    app.post("/login", authController.login);

    app.post("/logout", authController.logout);

};