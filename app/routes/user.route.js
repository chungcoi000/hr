const userController = require("../controllers/user.controller");
const courseController = require("../controllers/course.controller");
const categoryController = require('../controllers/category.controller');
module.exports = (app) => {

    //Staff
    //User Manager
    app.post("/staff/createAccount", userController.createTraineeAccount);
    app.get("/staff/createAccount", userController.getCreateAccount);
    app.post("/staff/deleteAccount", userController.deleteAccount);
    app.post("/staff/searchUser", userController.searchUser);

    // Course Manager
    app.post("/staff/getCourseById", courseController.getCourseById);

    app.post("/staff/addCourse", courseController.addCourse);
    app.get("/staff/addCourse", courseController.getAddCourse);

    app.post("/staff/deleteCourse", courseController.deleteCourse);
    app.post("/staff/updateCourse", courseController.updateCourse);
    app.get("/staff/updateCourse", courseController.getUpdateCourse);

    app.get("/staff/courseCate", courseController.getCourseFromCategory);
    app.post("/staff/addCourseToUser", courseController.addUserToCourse);
    app.post("/staff/deleteCourseFromUser", courseController.deleteUserFromCourse);
    app.post("/staff/searchCourse", courseController.searchCourse);

    //Category Manager
    app.get("/staff/getCate", categoryController.getCategory);
    app.post("/staff/addCate", categoryController.addCategory);
    app.get("/staff/addCate", categoryController.getAddCategory);
    app.post("/staff/updateCate", categoryController.updateCategory);
    app.get("/staff/updateCate", categoryController.getUpdateCategory);
    app.post("/staff/deleteCate", categoryController.deleteCategory);


    //API
    app.get("/api/getTrainee", userController.getTraineeAccount);
    app.get("/api/getTrainer", userController.getTrainerAccount);
    app.post("/api/updatePassword", userController.updatePassword);
    app.post("/api/updateInfo", userController.updateInformation);
    app.get("/api/getCourse", courseController.getCourse);
    app.get("/api/viewCourseAssigned", courseController.viewCourseAssigned);
};
