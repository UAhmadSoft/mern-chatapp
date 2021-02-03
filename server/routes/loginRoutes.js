const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const User = require('../schemas/UserSchema')

app.use(bodyParser.urlencoded({ extended: false }));


router.get("/", (req, res, next) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user })
    } else {
        res.send({ loggedIn: false, user: req.session.user })
    }
    res.status(200)
})

router.post("/", async (req, res, next) => {
    var payload = req.body;

    if (req.body.email && req.body.password) {
        let user = await User.findOne({
            email: req.body.email
        })
            .catch((error) => {
                console.log(error)
                payload.errorMessage = "Something went wrong.";
                return res.status(401).send({
                    error: error,
                    message: payload.errorMessage,
                });
            });

        if (user !== null) {
            let result = await bcrypt.compare(req.body.password, user.password)

            if (result === true) {
                req.session.user = user
                return res.json({})
            }
        }
        payload.errorMessage = "Login credentials incorrect.";
        return res.status(401).send({
            message: payload.errorMessage,
        });
    }
    payload.errorMessage = "Make sure each field has a valid value.";
    return res.status(401).send({
        message: payload.errorMessage,
    });
})


module.exports = router;