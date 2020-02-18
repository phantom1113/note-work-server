const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = token => {
    if (token) {
        try {
            const user = jwt.verify(token, process.env.jwtSecret);
            return user;
        } catch (err) {
            throw new Error('Invalid/Expire token');
        }
    }
    throw new Error('Authentication header token must be provided');
}