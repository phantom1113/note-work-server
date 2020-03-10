require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const Posts = require('./route/api/post');
const Auth = require('./route/api/auth');
const Comment = require('./route/api/comment');
const cors = require('cors');


const port = 5000

const app = express();


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




app.listen(port, () => console.log(`Server listening on port ${port}!`))