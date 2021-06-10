const adminController = require('../controllers/admin.controller');
const authController = require('../controllers/auth.controller');

module.exports = (app) => {
    app.use(function (req, res, next){
        try {
            if (req.session.user && req.session.user.role.name === "admin") {
                next();
            }
        } catch (err) {
            console.log(err);
            res.send({message : "No session found"})
        }
    });

    app.post("/admin/deleteAccount",
        adminController.deleteAccount);

    app.post("/admin/createAccount",
        adminController.createAccount);

    app.get("/admin/getAccount",
        adminController.getAccount);

    app.post("/admin/updateAccount",
        adminController.updateAccount);

};