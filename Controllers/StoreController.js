const StoreProfile = require('../Models/StoreModel');
const fs = require('fs');

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
        subDate: Date.now()

    })
    if(req.file){
        store.image = req.file.path
    }
  if(req.body.filename){
      store.filename = req.body.filename 
  }
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

// update store
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
        
    }
    if(req.file){
        updatedStore.image = req.file.path
    }
  if(req.body.filename){
      updatedStore.filename = req.body.filename 
  }

  StoreProfile.findById(storeID)
  .then(response => {
      fs.unlink(`${response.image}`,(err) => {
          if(err) console.log(err)
          else console.log('file deleted')
      })
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
            message: "An Error Occured"+ error
        })
    })
  })
  .catch(err => {
    res.json({
        message: "Minor Error Occured"
    })
})
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

module.exports = {
    indexStore, showStore, updateStore, deleteStore, addStore, searchStore
}