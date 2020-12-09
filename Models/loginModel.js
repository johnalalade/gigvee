const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const imageBasePath = 'uploads/'

const loginSchema = new Schema({
    image: {
        type: String,
        trim: true
    },
    filename: {
        type: String,
        trim: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bookmarks: [],
    notifications: []

}, {timestamps: true})

// loginSchema.virtual('imagePath').get(function() {
//     if(this.image != null && this.imageType != null) {
//         return `data:${this.imageType};charset=utf-8;base64,${this.image.toString(base64)}`
//     }
// })

const Login = mongoose.model('Login', loginSchema);
module.exports = Login
