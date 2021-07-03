const adminController = require('../controllers/admin.controller');

module.exports = (app) => {
    app.use(function (req, res, next){
        try {
            if (req.session && req.session.user.role === "admin") {
                    next();
            }
        } catch (err) {
            res.redirect("/login")
        }
    });

    app.delete("/admin/deleteAccount",
        adminController.deleteAccount);

    app.post("/admin/createAccount",
        adminController.createAccount);

    app.get('/admin/createAccount',
        adminController.getCreateAccount);

    app.get("/admin/getAccount",
        adminController.getAccount);

    app.post("/admin/updateAccount",
        adminController.updateAccount);

    app.get("/admin/updateAccount",
        adminController.getUpdateAccount);
};