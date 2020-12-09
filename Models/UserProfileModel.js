const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    avatar: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    bookmarks: [],
    notifications: []


}, {timestamps: true});

const UserProfile = mongoose.model('UserProfile', userProfileSchema)
module.exports = UserProfile
