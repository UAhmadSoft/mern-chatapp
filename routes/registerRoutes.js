const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const User = require('../schemas/UserSchema')


app.use(bodyParser.urlencoded({ extended: false }));

// router.get("/", (req, res, next) => {
//     res.status(200).render("register");
// })

router.post("/", async (req, res, next) => {

    let username = req.body.username.trim();
    let email = req.body.email.trim();
    let password = req.body.password;

    let payload = req.body;

    if (username && email && password) {
        let user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
            .catch((error) => {
                console.log(error)
                payload.errorMessage = "Something went wrong.";
                res.status(401).send({
                    error: error,
                    message: payload.errorMessage,
                });
            });

        if (user == null) {
            // No user found
            let data = req.body;

            data.password = await bcrypt.hash(password, 10)

            User.create(data)
                .then((user) => {
                    req.session.user = user;
                    return res.json({})
                })

        } else {
            // User found
            if (email === user.email) {
                payload.errorMessage = "Email already in use.";

            } else {
                payload.errorMessage = "Username already in use.";

            }
            res.status(401).send({
                message: payload.errorMessage,
            });
        }

    }
    else {
        payload.errorMessage = "Make sure each field has a valid value.";
        res.status(401).send({
            message: payload.errorMessage,
        });
    }
})

module.exports = router;