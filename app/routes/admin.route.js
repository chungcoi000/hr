const adminController = require('../controllers/admin.controller');

module.exports = (app) => {
    app.use(function (req, res, next){
        try {
            if (req.session ) {
                if(req.session.user.role === "admin") next();
            }
        } catch (err) {
            console.log(err);
            res.send({message : "No session found"})
        }
    });

    app.get("/admin/deleteAccount",
        adminController.deleteAccount);

    app.post("/admin/createAccount",
        adminController.createAccount);

    app.get('/admin/createAccount',
        adminController.getCreateAccount);

    app.get("/admin/getAccount",
        adminController.getAccount);

    app.post("/admin/updateAccount",
        adminController.updateAccount);

    app.post("/admin/getAccountById",
        adminController.getAccountById);
};