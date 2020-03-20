require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
var http= require('http')
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const Posts = require('./route/api/post');
const Auth = require('./route/api/auth');
const Comment = require('./route/api/comment');
const cors = require('cors');


const port = 5000

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()) ;


//Connect to MongoDB
mongoose
    .connect(process.env.MONGODB,{
        useNewUrlParser:true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

    
app.use('/api/posts', Posts);
app.use('/api/auth', Auth);
app.use('/api/comment', Comment);

io.on('connection', function (socket) {
    console.log('Connected')
    socket.on('like event',(data) => {
        socket.broadcast.emit('like event from another client',data)
    });
    socket.on('commnet event',(data) => {
        socket.broadcast.emit('comment event from another client',data)
    });
});



server.listen(port, () => console.log(`Server listening on port ${port}!`))