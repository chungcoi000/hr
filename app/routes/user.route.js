const userController = require("../controllers/user.controller");
const courseController = require("../controllers/course.controller");
const categoryController = require('../controllers/category.controller');
module.exports = (app) => {

    //Staff
    //User Manager
    app.post("/staff/createAccount", userController.createTraineeAccount);
    app.post("/staff/deleteInfo", userController.deleteInformation);
    app.post("/staff/getAccountById", userController.getAccountById);
    app.post("/staff/searchUser", userController.searchUser);

    // Course Manager
    app.get("/staff/getCourse", courseController.getCourse);
    app.post("/staff/getCourseById", courseController.getCourseById);
    app.post("/staff/addCourse", courseController.addCourse);
    app.post("/staff/deleteCourse", courseController.deleteCourse);
    app.post("/staff/updateCourse", courseController.updateCourse);
    app.get("/staff/courseCate", courseController.getCourseFromCategory);
    app.post("/staff/addCourseToUser", courseController.addUserToCourse);
    app.post("/staff/deleteCourseFromUser", courseController.deleteUserFromCourse);
    app.post("/staff/searchCourse", courseController.searchCourse);

    //Category Manager
    app.get("/staff/getCate", categoryController.getCategory);
    app.post("/staff/addCate", categoryController.addCategory);
    app.post("/staff/updateCate", categoryController.updateCategory);
    app.post("/staff/deleteCate", categoryController.deleteCategory);

    //User
    app.get("/user/viewCourse", courseController.viewCourseAssigned);

    //API
    app.get("/api/getTrainee", userController.getTraineeAccount);
    app.get("/api/getTrainer", userController.getTrainerAccount);
    app.post("/api/updatePassword", userController.updatePassword);
    app.post("/api/updateInfo", userController.updateInformation);
};
