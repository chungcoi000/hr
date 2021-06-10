const userController = require("../controllers/user.controller");
const courseController = require("../controllers/course.controller");
module.exports = (app) => {
    // app.use(function (req, res, next){
    //     try {
    //         if (req.session.user) {
    //             next();
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         res.send({message : "No session found"})
    //     }
    // });
    //Staff
    //Trainee Manager
    app.post("/staff/createAccount", userController.createTraineeAccount);

    app.post("/staff/deleteAccount", userController.deleteTraineeInformation);

    app.post("/staff/updateAccount", userController.updateTraineeInformation);

    app.get("/staff/getTrainee", userController.getTraineeAccount);

    // Course Manager

    app.get("/staff/getCourse", courseController.getCourse);

    app.post("/staff/addCourse", courseController.addCourse);

    app.post("/staff/deleteCourse", courseController.deleteCourse);

    app.post("/staff/updateCourse", courseController.updateCourse);

};