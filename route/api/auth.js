const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateRegisterInput, validateLoginInput } = require('../../ultils/validator');
const checkAuth = require('../../ultils/checkAuth');

require('dotenv').config()
//User Model
const User = require('../../models/User');

function generalToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
            urlAvatar: user.urlAvatar
        },
        process.env.jwtSecret,
        { expiresIn: '1h' }
    );
}

//Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    //Simple validation
    if (!email || !password) {
        return res.status(400).json({ errors: 'Please enter all fields' });
    }

    //Check for existing user
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ errors: 'User does not exists' })

            //Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ errors: 'Password is wrong !!!' })
                    jwt.sign(
                        {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            urlAvatar: user.urlAvatar
                        },
                        process.env.jwtSecret,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            return res.json({
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

//Register
router.post('/register', async (req, res) => {
    try {
        let { username, email, password, confirmPassword, urlAvatar } = req.body
        console.log(req.body)
        //Validate user data
        const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
        if (!valid) {
            return res.status(400).json({ errors: errors })
        }
        //Make sure user doesnt already exist
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: { usertaken: "User are taken" } })
        }
        //hash password and create an auth token
        password = await bcrypt.hash(password, 12);

        const newUser = new User({
            email,
            username,
            password,
            createdAt: new Date().toISOString(),
            urlAvatar
        });
        const userRegister = await newUser.save();
        const token = generalToken(userRegister)

        return res.json({
            ...userRegister._doc,
            id: res._id,
            token
        });
    } catch (err) {
        return res.json({ errors: err })
    }
})

router.post('/loaduser', async (req, res) => {
    try {
        let { token } = req.body;
        const {email} = checkAuth(token);
        User.findOne({ email })
        .then(user=>{
            return res.json({
                email: user.email,
                username: user.username,
                urlAvatar: user.urlAvatar
            });
        })
    } catch (err) {
        return res.json({ errors: err })
    }
})

module.exports = router;