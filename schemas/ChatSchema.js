const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    users: [{
        type: Schema.Types.ObjectId, ref: "User"
    }],
    latestMessage: {
        type: Schema.Types.ObjectId, ref: "Message"
    }
}, { timestamps: true })

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;