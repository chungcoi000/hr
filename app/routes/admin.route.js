const adminController = require('../controllers/admin.controller');
const authJwt = require('../middlewares/awthJwt');

module.exports = (app) => {
    app.use(function (req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    app.post("/admin/deleteAccount/:id", adminController.deleteAccount);

    app.post("/admin/createAccount", adminController.createAccount);

    app.get("/admin/getAccount", adminController.getAccount);

    app.post("/admin/updateAccount/:id", adminController.updateAccount);
};