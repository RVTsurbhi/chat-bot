/******* Models *********/
const chatModel = require('../models/chat');
const groupModel = require('../models/group');
const userModel = require('../models/user');

/******** Helpers **********/
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env
const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
const {group, message } = require('../validators/chat');

/*********** SOCKET SERVER **************/

const socketServer = (io)=>{
    io.use(function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token){
            console.log(111);
          jwt.verify(socket.handshake.query.token, JWT_SECRET, { ignoreExpiration: true}, 
          function(err, decoded) {
            // if (err) return next(new Error('Authentication error'));
            if(err) return socket.emit('Error', { is_success: false, message: err, responseCode: 400 }) 
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
                    socket.userId = sessionData._id.toString();            
                    console.log('A user is connected.', socket.id);
                    next();
                }
            })
          });
        }
        else {
          console.log('auth error');
          // next(new Error('Authentication error'));
          socket.emit('Error', { is_success: false, message: "unauthenticated", responseCode: 400 })
        }    
      })
        .on('connection', async (socket) => {
            let socket_id = socket.id
            console.log('A user is connected.', socket.id);
            
          // Connection now authenticated to receive further events

          //create room for chat
          socket.on('createRoom', async (room) =>{
            let groupForm = await group.validateAsync(room)
            groupForm.members.push(socket.userId)
            if(groupForm.type === 'single'){
              let groupData = await groupModel.findOne(groupForm)
              if(groupData){
                  io.sockets.in(socket_id).emit("room-error", {message : "Chat with this User Already Exist"})
                  socket.emit('authenticated', { is_success: false, message: 'Authentication failed.', responseCode: 401 })
              }
            }else {
                if(!groupForm.name){
                    io.sockets.in(socket_id).emit("room-error", {message : "name is required for creating group."})
                }
            }
            await new groupModel(groupForm).save()

            io.emit('createRoom', room);
          });
          
          //sending message
          socket.on('message', async (msg) => {
            let chatForm = await message.validateAsync(msg);
            chatForm.from_user = socket.userId
            await new chatModel(chatForm).save()
            io.emit('message', msg);
          });
          
          //Whenever someone disconnects this piece of code executed
          socket.on('disconnect', function () {
            console.log('A user disconnected', socket.id);
          });
      });


      // io.on('connection', function(socket) {
      //    console.log('A user connected', socket.id);

      //    //Whenever someone disconnects this piece of code executed
      //    socket.on('disconnect', function () {
      //       console.log('A user disconnected', socket.id);
      //    });
      // });
}

module.exports = socketServer