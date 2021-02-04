const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    if (req.session) {
        req.session = null
        res.clearCookie('userId')
        res.json({})
    }
    res.status(400)
})



module.exports = router;