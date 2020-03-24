const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    urlAvatar: String
});

module.exports = model('User', UserSchema);