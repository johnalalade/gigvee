const Products = require('../Models/ProductsModel');
const fs = require('fs');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-east-2'
// search of Products

const searchProducts = (req, res, next) => {
    let search = req.body.data
    console.log(search)
    Products.find({$or: [{productName: new RegExp(search, "ig")}, {storename: new RegExp(search, "ig")}, {productDescription: new RegExp('^'+search+'$',"igm")}]})
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
    let store = {
        owner: req.body.owner,
        storename: req.body.storename,
        productName: req.body.productname,
        productDescription: req.body.productDescription,
        location: {longitude: req.body.longitude,
                   latitude: req.body.latitude,
                   address: req.body.address, },
        
        phone: req.body.phone,
        email: req.body.email, 
        distance: '',
        comments: [],
        src: `https://gigvee.s3.us-east-2.amazonaws.com/${uuidv4()+req.body.filename.trim()}`

    }
 {   // if(req.files) {
    //     let path = ''
    //     req.files.forEach(function(files,index,arr){
    //         path = path + files.path + ','
    //     })
    //     path = path.substring(0, path.lastIndexOf(","))
    //     store.avatar = path
    // }
//     if(req.file){
//         store.image = req.file.path
//     }
//   if(req.body.filename){
//       store.filename = req.body.filename 
//   }
    // if(req.body.comment){
    //     store.comments = store.comments.unShift(req.body.comment)
    // }
 }
    if(req.file){
        fs.readFile(req.file.path, (err,data)=> {
            if(err) throw err;
            const s3 = new aws.S3();
            const s3Params = {
                Bucket: S3_BUCKET,
                Key: store.src.slice(42),
                Body: data,
                // Expires: 180,
                ContentType: req.file.mimetype,
                ACL: 'public-read'
              };
             // console.log(data)
              s3.putObject(s3Params, function (s3Err,data) {
                if(s3Err) throw s3Err
                
                console.log('File uploaded successfully at --> '+ data.Location)
                fs.unlink(req.file.path, (err)=> {
                    if(err) res.send({message:'Unable to delete used file '+ err})
                    else console.log('file deleted')
                })
              })
              
        })
    }
    let product = new Products(store)
    product.save()
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

// delete product

const deleteProduct = (req, res, next) => {
    let productID = req.body.product
   // console.log(productID)
    Products.findByIdAndRemove(productID)
    .then((response) => {

        const s3 = new aws.S3();
        const imgName = response.src.slice(42)
        const s3Params = {
            Bucket: S3_BUCKET,
            Key: imgName,
            // Expires: 180,
            // ContentType: fileType,
            // ACL: 'public-read'
          };
          s3.deleteObject(s3Params, function(err, data) {
              if(err) console.log("image deletion failed"+err, err.stack)
              else console.log("image deleted") 
          })

        res.json({
            message: "Product Deleted"
        })
    })
    .catch(() => {
        res.json({
            message: "An Error Occured"
        })
    })
}

// commenting
const commenting = (req, res, next) =>{
    let productID =  req.body.productID
    let comment = req.body.comment
    let comments
    Products.findById(productID)
    .then((data) => {
       let comm = data.comments
       
       //console.log(comment)
    //    console.log(comm)
    //    console.log(comment)
       if(comm){
        comments = [comment,...comm]
        
       }
       else{
           comments = [comment]
       }
      
      let updatedProduct = {
       comments: comments.slice(0,51)
    }
    console.log(updatedProduct.comments)
    Products.findByIdAndUpdate(productID, {$set: updatedProduct})
    .then(() => {
        console.log({
            message: "Comment Add Successfully"
        })
    })
    .catch(error => {
        res.json({
            message: "An Error Occured"+ error
        })
    })

    })
    .then(() => {
        res.json({
            message: "Comment Add Successfully"
        })
    })
    .catch(err => console.error("Error Ooo! " + err))
    
    
    
}
module.exports = {
    indexProducts, showProduct, updateProduct, deleteProduct, addProduct, searchProducts, myProducts, commenting
}

// , {productDescription: new RegExp(search, "igm")}