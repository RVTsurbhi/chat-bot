const express = require('express');
const router = express.Router();

/********* import controllers ********/
const accountController = require('../controllers/account');
const chatController = require('../controllers/chatting');
const {verifyToken} = require('../utils/middleware');

/********* Routes *********/
router.post('/account/signup', accountController.userSignup);
router.post('/account/signIn', accountController.userLogin);

/********** chats **************/
router.post('/chat/room', verifyToken() ,chatController.createGroup);
router.post('/chat/sendMessage', verifyToken() ,chatController.sendMessage);
router.get('/chat/conversation', verifyToken() ,chatController.getConversation);
router.get('/chat/messages', verifyToken() ,chatController.getAllMessages);

module.exports = router;