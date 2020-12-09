const Products = require('../Models/ProductsModel');
const fs = require('fs');

// search of Products

const searchProducts = (req, res, next) => {
    let search = req.body.data
    console.log(search)
    Products.find({$or: [{productName: search}, {storename: search}]})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(error)
        res.json({
            message: "An error Occured"
        })
    })

}

// show my Products

const myProducts = (req, res, next) => {
    let ownerId = req.body.ownerId
    
    Products.find({owner: ownerId})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: "An error Occured"+ error
        })
    })
}

// show list of Products

const indexProducts = (req, res, next) => {
  
    Products.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(error)
        res.json({
            message: "An error Occured"
        })
    })
}

// show one product

const showProduct = (req, res, next) => {
    let productID = req.body.productID
    Products.findById(productID)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        
        res.json({
            message: "Can't Find User"
        })
    })

}

// add product
const addProduct = (req, res, next) => {
    let store = new Products({
        owner: req.body.owner,
        storename: req.body.storename,
        productName: req.body.productname,
        productDescription: req.body.productDescription,
        location: {longitude: req.body.longitude,
                   latitude: req.body.latitude,
                   address: req.body.address, },
        
        phone: req.body.phone,
        email: req.body.email, 
        distance: ''

    })
    // if(req.files) {
    //     let path = ''
    //     req.files.forEach(function(files,index,arr){
    //         path = path + files.path + ','
    //     })
    //     path = path.substring(0, path.lastIndexOf(","))
    //     store.avatar = path
    // }
    if(req.file){
        store.image = req.file.path
    }
  if(req.body.filename){
      store.filename = req.body.filename 
  }
    if(req.body.comment){
        store.comments = store.comments.unShift(req.body.comment)
    }
    store.save()
    .then(response => {
        res.json({
            message: "product Added Succecfully"
        })
    })
    .catch(error => {
        
        res.json({
            message: "An Error Occured"+ error
        })
    })
}
// update a product

const updateProduct = (req, res, next) => {

    let productID = req.body.productID

    let updatedProduct = { }

    if(req.body.storename){
        updatedProduct.storename = req.body.storename 
    }
    if(req.body.productname){
        updatedProduct.productName = req.body.productname 
    }
    if(req.body.productDescription){
        updatedProduct.productDescription = req.body.productDescription 
    }
    if(req.body.location.longitude){
        updatedProduct.location.longitude = req.body.location.longitude 
    }
    if(req.body.location.latitude){
        updatedProduct.location.longitude = req.body.location.latitude 
    }
    if(req.body.phone){
        updatedProduct.phone = req.body.phone 
    }
    if(req.body.email){
        updatedProduct.email = req.body.email 
    }
    if(req.bodycomment){
        updatedProduct.comments = updatedProduct.comments.unShift(req.bodycomment) 
    }
    if(req.body.distance){
        updatedProduct.distance = req.body.distance 
    }
    if(req.file){
        updatedProduct.image = req.file.path
    }
  if(req.body.filename){
      updatedProduct.filename = req.body.filename 
  }

    Products.findByIdAndUpdate(productID, {$set: updatedProduct})
    .then(() => {
        res.json({
            message: "Profile Updated Successfully"
        })
    })
    .catch(error => {
        res.json({
            message: "An Error Occured"
        })
    })
}

// delete store

const deleteProduct = (req, res, next) => {
    let productID = req.body.product
    console.log(productID)
    Products.findByIdAndRemove(productID)
    .then((response) => {
        
        fs.unlink(`${response.image}`,(err) => {
            if(err) console.log(err)
            else console.log('file deleted')
        })
        res.json({
            message: "Store Deleted"
        })
    })
    .catch(() => {
        res.json({
            message: "An Error Occured"
        })
    })
}

module.exports = {
    indexProducts, showProduct, updateProduct, deleteProduct, addProduct, searchProducts, myProducts
}