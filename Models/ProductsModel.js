const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
    owner: {
        type: String
    },
    src: {
        type: String
    },
    storename: {
        type: String,
        required: true
    }, 
    productName: {
        type: String
    },
    productDescription: {
        type: String
    },
    location: {
        longitude: {type: Number},
        latitude: {type: Number},
        address: {type: String}
    },
    comments: [],
    phone: {
        type: String
    },
    email: {
        type: String
    },
    distance: {
        type: Number
    }

}, {timestamps: true});

const Products = mongoose.model('Products', ProductsSchema)
module.exports = Products
