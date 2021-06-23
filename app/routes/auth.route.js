const authController = require('../controllers/auth.controller');

module.exports = (app) => {

    app.post("/login", authController.login);
    app.get("/login", (req, res) => {
        res.render("auth/login");
    });

    app.get("/logout", authController.logout);

};