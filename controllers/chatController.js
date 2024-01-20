const Chat = require('../models/Chat');
const User = require('../models/User');

module.exports.getChats = async (req, res) => {
    const userId = req.cookies.user_id;
    const user = await User.findById(userId);
    const chatIDs = user.chats;
    const chats = [];
    for (let chatID of chatIDs) {
        chats.push(await Chat.findById(chatID));
    }
    chats.sort((a, b) => a.updatedAt - b.updatedAt);


    res.render('pages/chats', { title: "chats", user: user.name, chats: chats, userID: user._id })
}

module.exports.sendMessage = async (io, connectedUsers, userID, receivedMessage) => {
    var message = {
        text: receivedMessage.text,
        sender: userID
    }
    var chat = await Chat.findById(receivedMessage.chatID);
    chat.messages.push(message);
    chat = await Chat.findByIdAndUpdate(receivedMessage.chatID, chat, {
        returnOriginal: false
    });
    var receiverID;
    for (var user of chat.users) {
        if (user.user != userID) {
            receiverID = user.user;
        }
    }
    console.log(receivedMessage.chatID)
    console.log(chat.messages)


    message = chat.messages.find((o) => o._id === receivedMessage.chatID)
    const receiverSocketId = connectedUsers[receiverID];
    const senderSocketId = connectedUsers[userID];
    console.log(message)
    if (receiverSocketId) {
        io.to(receiverSocketId).to(senderSocketId).emit('message', { message: message });
    }
}