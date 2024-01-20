const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userCredential: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userCredential"
    },
    name: {
        type: String
    },
    meals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "meal"
        }
    ],
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "chat"
        }
    ]
}, { timestamps: true });

const User = mongoose.model("user", userSchema);
module.exports = User;