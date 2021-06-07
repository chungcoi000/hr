const authJwt = require("../middlewares/awthJwt");
const userController = require("../controllers/user.controller");

module.exports = (app) => {
    app.use(function (req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

};