const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require("./app/models");
const dbConfig = require("./app/config/db.config")
const Role = db.role;

const app = express();

const corsOption = {
    origin: "http://localhost:8081"
};

db.mongoose
    .connect(dbConfig.url, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => {
        console.log("Connect to MongoDB successful");
        initial();
    })
    .catch(err => {
        console.log("Can't connect to MongoDB", err);
        process.exit();
    })

app.use(cors(corsOption));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended : true }));

require("./app/routes/admin.route")(app);
require("./app/routes/auth.route")(app);
require("./app/routes/user.route")(app);

const PORT = process.env.PORT | 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            //add admin role to db
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    return console.log("error", err);
                }
                console.log("Added 'admin' to role collections");
            });

            //add staff role to db
            new Role({
                name: "staff"
            }).save(err => {
                if (err) {
                    return console.log("error", err);
                }
                console.log("Added 'staff' to role collections");
            });

            //add trainer role to db
            new Role({
                name: "trainer"
            }).save(err => {
                if (err) {
                    return console.log("error", err);
                }
                console.log("Added 'trainer' to role collections");
            });

            //add trainee role to db
            new Role({
                name: "trainee"
            }).save(err => {
                if (err) {
                    return console.log("error", err);
                }
                console.log("Added 'trainee' to role collections");
            });
        }
    });
}