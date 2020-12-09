const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    image: {
        type: String,
        trim: true
    },
    filename: {
        type: String,
        trim: true
    },
    storename: {
        type: String,
        required: true
    }, 
    storeType: {
        type: String
    },
    storeDescription: {
        type: String
    },
    location: {
        longitude: {type: Number},
        latitude: {type: Number},
        address: {type: String}
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    sub: {type: Number},
    subDate: {type: Date}


}, {timestamps: true});

const StoreProfile = mongoose.model('StoreProfile', storeSchema)
module.exports = StoreProfile
