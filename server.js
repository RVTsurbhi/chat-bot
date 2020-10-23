const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const helmet = require('helmet');
const cors = require('cors');
// const socketIo = require('socket.io');
const path = require('path')

//import from inside modules
const dbConnection = require('./server/settings/dbSetting');
const errorHandler = require('./server/utils/errorHandler');
const routes = require('./server/routers/apis');

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//routes
app.use('/api', routes);
app.use(express.static(__dirname + 'public'));
// app.use(express.static('public'));
//views
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/server/views/index.html');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(errorHandler)

//create server
var http = require('http');
const server = http.createServer(app);

//socket server on top of http server
const io = socketIo(server)
// export io to use it in other file
module.exports.io = io;
require("./server/settings/socket")(io);

app.listen(process.env.PORT || 3001, ()=>
    console.log(`Server is running on ${process.env.PORT}`)    
)