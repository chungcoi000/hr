const userController = require("../controllers/user.controller");
const courseController = require("../controllers/course.controller");
const categoryController = require('../controllers/category.controller');
module.exports = (app) => {
    //Staff

    app.post("/staff/createAccount", userController.createTraineeAccount);

    app.post("/staff/deleteInfo", userController.deleteInformation);
    app.post("/staff/updateInfo", userController.updateInformation);
    app.get("/staff/getTrainee", userController.getTraineeAccount);
    app.get("/staff/getTrainer", userController.getTrainerAccount);
    // Course Manager

    app.get("/staff/getCourse", courseController.getCourse);
    app.post("/staff/addCourse", courseController.addCourse);
    app.post("/staff/deleteCourse", courseController.deleteCourse);
    app.post("/staff/updateCourse", courseController.updateCourse);
    app.get("/staff/courseCate", courseController.getCourseFromCategory);

    //Category Manager
    app.get("/staff/getCate", categoryController.getCategory);
    app.post("/staff/addCate", categoryController.addCategory);
    app.post("/staff/updateCate", categoryController.updateCategory);
    app.post("/staff/deleteCate", categoryController.deleteCategory);

};
