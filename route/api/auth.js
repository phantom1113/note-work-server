const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//const config = require('config');
const jwt = require('jsonwebtoken');

require('dotenv').config()
//User Model
const User = require('../../models/User');

router.post('/', (req, res) => {
    const { email, password } = req.body;
    //Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    //Check for existing user
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exists' })

            //Validate password
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(!isMatch) return res.status(400).json({msg: 'Password is wrong !!!'})
                jwt.sign(
                    {   
                        id: user.id,
                        email: user.email,
                        username: user.username
                    },
                    process.env.jwtSecret,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            token,
                            user: {
                                _id: user._id,
                                name: user.name,
                                email: user.email,
                            }
                        });
                    }
                )
            })
        })        

});

module.exports = router;