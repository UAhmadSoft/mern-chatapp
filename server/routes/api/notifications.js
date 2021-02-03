const express = require('express');
const router = express.Router();
const Notification = require('../../schemas/NotificationSchema');

const mongoose = require('mongoose');


router.get('/latest', async (req, res, next) => {
    Notification.find({ userTo: req.session.user._id, opened: false })
        .populate('userTo')
        .populate('userFrom')
        .sort({ createdAt: -1 })
        .then(results => res.status(200).send(results))
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })
})


router.put('/markasread', async (req, res, next) => {
    Notification.updateMany({ userTo: req.session.user._id, entityId: req.query.conversationId }, { opened: true })
        .then(results => res.status(200).send(results))
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })
})


module.exports = router;