const authJwt = require("../middlewares/awthJwt");
const userController = require("../controllers/user.controller");
const courseController = require("../controllers/course.controller");
module.exports = (app) => {
    app.use(function (req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //Staff
    //Trainee Manager
    app.post("/staff/createAccount", userController.createTraineeAccount);

    app.post("/staff/deleteAccount", userController.deleteTraineeInformation);

    app.post("/staff/updateAccount", userController.updateTraineeInformation);

    app.get("/staff/getTrainee", userController.getTraineeAccount);

    // Course Manager

    app.post("/staff/addCourse", courseController.addCourse);
};