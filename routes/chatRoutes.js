const { Router } = require('express');
const router = Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const { Server } = require("socket.io");
const chatController = require('../controllers/chatController');
const { requireAuth } = require('../middleware/authMiddleware');
var cookie = require("cookie")

const connectedUsers = {};


router.get('/chats', requireAuth, chatController.getChats)

module.exports = (httpServer) => {
    const io = new Server(httpServer);
    io.on('connection', function (socket) {

        var cookies = cookie.parse(socket.handshake.headers.cookie);
        var userIDCookie = cookies.user_id;
        var userID = userIDCookie.split(":")
        userID = JSON.parse(userID[1]);
        connectedUsers[userID] = socket.id

        console.log('connection is made, USER:', userID);

        socket.on('message', chatController.sendMessage.bind(null, io, connectedUsers, userID))

        socket.on('disconnect', function () {
            delete connectedUsers.userID;
            console.log('Disconnected, USER:', userID);
        });
    })

    return router;
};