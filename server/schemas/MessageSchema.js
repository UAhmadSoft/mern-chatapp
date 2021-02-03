const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    content: {
        type: String, trim: true
    },
    chat: {
        type: Schema.Types.ObjectId, ref: 'Chat'
    },
    readBy:
        [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true })

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;