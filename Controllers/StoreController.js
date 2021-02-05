const StoreProfile = require('../Models/StoreModel');
const fs = require('fs');
const aws = require('aws-sdk');

const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-east-2'

// search store

const searchStore = (req, res, next) => {
    let search = req.body.search
    StoreProfile.find(search)
    .then(response => {
        res.josn({
            response 
        })
    })
    .catch(error => {
        res.json({
            message: "An error occured"
        })
    })
}

// show list of store

const indexStore = (req, res, next) => {
    StoreProfile.find()
    .then(response => {
        res.josn({
            response
        })
    })
    .catch(error => {
        res.json({
            message: "An error occured"
        })
    })
}

// show one Store

const showStore = (req, res, next) => {
    let storeID = req.body.storeID
    StoreProfile.findById(storeID)
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

// add store

const addStore = (req, res, next) => {
    let store = new StoreProfile({
        _id: req.body.storeID,
        storename: req.body.storename,
        storeType: req.body.storetype,
        storeDescription: req.body.storedescription,
        location: {longitude: req.body.longitude,
                   latitude: req.body.latitude,
                   address: req.body.address},
        email: req.body.email,
        phone: req.body.phone,
        sub: 2,
        subDate: Date.now(),
        src: req.body.src,
        comments: []
    })
   
    store.save()
    .then(response => {
        
        res.json({
            message: "Store Added Succecfully"
        })
    })
    .catch(error => {
        res.json({
            message: "An Error Occured"+ error
        })
    })
}

// update-subscription-date for store
const dateStore = (req, res, next) => {
    let storeID = req.body.storeID

    let updatedStore = {
        sub: 2,
        subDate: req.body.subDate
    }

    StoreProfile.findByIdAndUpdate(storeID, {$set: updatedStore})
    .then(() => {
        res.json({
            message: "Profile Updated Successfully"
        })
    })
    .catch(error => {
        res.json({
            message: "An Error Occured"+ error
        })
    })

}

// update store
const updateStore = (req, res, next) => {

    let storeID = req.body.storeID

    let updatedStore = {
        
        storename: req.body.storename,
        storeType: req.body.storetype,
        storeDescription: req.body.storedescription,
        location: {longitude: req.body.longitude,
                   latitude: req.body.latitude,
                   address: req.body.address},
        email: req.body.email,
        phone: req.body.phone,
        src: req.body.src
        
    }
    StoreProfile.findById(storeID)
    .then((data) => {
        if(req.body.checkerImage === true){
        if(data.src){  
                console.log(req.body.checkerImage)
        const s3 = new aws.S3();
        const imgName = data.src.slice(32)
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
        }
          }
          else{return}
         
    })
    .then(() => {
        StoreProfile.findByIdAndUpdate(storeID, {$set: updatedStore})
    .then(() => {
        res.json({
            message: "Profile Updated Successfully"
        })
    })
    .catch(error => {
        res.json({
            error,
            message: "An Error Occured"
        })
    })
    })
    .catch((err) => console.log(err))
    
}

// delete store

const deleteStore = (req, res, next) => {
    let storeID = req.body.storeID
    StoreProfile.findByIdAndRemove(storeID)
    .then(() => {
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

// commenting
const commenting = (req, res, next) =>{
    let storeID =  req.body.storeID
    let comment = req.body.comment
    let comments
    StoreProfile.findById(storeID)
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
      
      let updatedStore = {
       comments: comments.slice(0,51)
    }
    console.log(updatedStore.comments)
    StoreProfile.findByIdAndUpdate(storeID, {$set: updatedStore})
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
    indexStore, showStore, updateStore, deleteStore, addStore, searchStore, commenting
}