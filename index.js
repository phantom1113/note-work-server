require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
var bodyParser = require('body-parser')
const Posts = require('./route/api/post');
const Auth = require('./route/api/auth')

const port = 3000

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 


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




app.listen(port, () => console.log(`Server listening on port ${port}!`))