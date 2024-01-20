const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    users: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        name: {
            type: String
        }
    }],
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            received: {
                done: { type: Boolean, default: false },
                time: { type: Date, default: Date() }
            },
            read: {
                done: { type: Boolean, default: false },
                time: { type: Date, default: Date() }
            },
            text: {
                type: String
            },
            time: {
                type: Date,
                default: Date()
            }
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model("chat", chatSchema);
module.exports = Chat;