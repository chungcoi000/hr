const adminController = require('../controllers/admin.controller');

module.exports = (app) => {
    app.post("/admin/createAccount", adminController.createAccount);
}