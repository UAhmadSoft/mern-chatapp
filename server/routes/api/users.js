const express = require('express');
const router = express.Router();
const User = require('../../schemas/UserSchema');

// Get user list
router.get('/', async (req, res, next) => {
    User.find({ _id: { $ne: req.session.user._id } }).then(function (users) {
        res.status(200).send(users);
    });
})

// Search for users
router.post('/', async (req, res, next) => {
    let searchObj = req.body

    if (req.body.query !== undefined) {
        searchObj = {
            $or: [
                { username: { $regex: req.body.query, $options: 'i' } }
            ]
        }
    }

    User.find(searchObj)
        .then(results => {
            res.status(200).send(results)
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400)
        })
})

module.exports = router;