const express = require('express');
const router = express.Router();
const User = require('../../schemas/UserSchema');
const Chat = require('../../schemas/ChatSchema');
const mongoose = require('mongoose');

// get chat by id
router.get("/chatId", async (req, res, next) => {
    Chat.findOne({ _id: req.query.chatId, users: { $elemMatch: { $eq: req.session.user._id } } })
        .populate("users")
        .then(results => res.status(200).send(results))
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
})


// Get a list of chats
router.get('/', async (req, res, next) => {
    Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } } })
        .populate('users')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async results => {
            results = await User.populate(results, { path: 'latestMessage.sender' })
            res.status(200).send(results)
        })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })
})

// Create new chat between users
router.post('/', async (req, res, next) => {
    if (!req.body.user) {
        console.log('User id not sent with request');
        return res.sendStatus(400)
    }

    let userTo = mongoose.Types.ObjectId(req.body.user._id)
    let userFrom = mongoose.Types.ObjectId(req.session.user._id)

    Chat.findOneAndUpdate(
        {
            users: {
                $all: [
                    { $elemMatch: { $eq: userTo } },
                    { $elemMatch: { $eq: userFrom } },
                ],
            },
        },
        {
            users: [req.body.user._id, req.session.user._id]
        },
        {
            upsert: true, returnNewDocument: true, setDefaultsOnInsert: true
        },
    )
        .populate('users')
        .then(results => res.status(200).send(results))
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
        })
})




module.exports = router;