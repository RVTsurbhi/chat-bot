/******* Models *********/
const chatModel = require('../models/chat');
const groupModel = require('../models/group');
const userModel = require('../models/user');

/******** Helpers **********/
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env
const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
// const {group, message } = require('../validators/chat');

/*********** SOCKET SERVER **************/

const socketServer = (io)=>{
    io.use(function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token){
            console.log(111);
          jwt.verify(socket.handshake.query.token, JWT_SECRET, { ignoreExpiration: true}, 
          function(err, decoded) {
            if (err) return next(new Error('Authentication error'));
            console.log(2222);
            socket.decoded = decoded;
            userModel.findOne({ token : token }).exec((err, sessionData)=>{
                if(err){
                    console.log('error');
                    socket.emit('Error', { is_success: false, message: err, responseCode: 400 })
                }else if (!sessionData) {
                    console.log('token not found');
                    socket.emit('authenticated', { is_success: false, message: 'Authentication failed.', responseCode: 401 })
                    socket.disconnect();
                }else {
                    console.log('A user is connected.');
                    next();
                }
            })
          });
        }
        else {
          next(new Error('Authentication error'));
        }    
      })
        .on('connection', function(socket) {
            console.log('A user is connected.');
          // Connection now authenticated to receive further events
          socket.on('message', function(message) {
            io.emit('message', message);
          });
      });
}

module.exports = socketServer