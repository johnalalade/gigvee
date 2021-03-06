const StoreProfile = require('../Models/StoreModel');
const fs = require('fs');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer')

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
    let store = {
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
        comments: [],
    }
    if(req.file){
        store.src= `https://gigvee.s3.us-east-2.amazonaws.com/${uuidv4()+req.body.filename.trim()}`
        
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
              s3.putObject(s3Params, function (s3Err,data) {
                if(s3Err) throw s3Err
                
                console.log('File uploaded successfully at --> '+ data.Location)
                fs.unlink(req.file.path, (err)=> {
                    if(err) console.log('Unable to delete used file '+ err)
                    else console.log('file deleted')
                })
              })
              
        })
    }

    //email
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gigveeteam@gmail.com',
            pass: 'JohnAlalade@4444'
        }
    });

    var mailOptions = {
        from: 'gigveeteam@gmail.com',
        to: req.body.email,
        subject: 'GigVee Stores',
        html: `<h1> <strong>GigVee Stores</strong> </h1> <p>Hurray! We are glad to inform you that you have successfully opend a store called "${req.body.storename}" on Gigvee.</p> <p>Congratulations, now you can post anything you do on your store, and other users will be able to see your posts and contact you!.</p> <p>Here are  some useful tips you should try out</p> <ul> <li>As products will be deleted after 10 days, try posting a product every week</li> <li>Update your store only when neccesary</li> <li>Make sure your contact information are correct</li> <li>Be available to accept orders</li> </ul> <p>Kind regards..</p><quote>~John Alalade (Team Leader)</quote>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("Emailimg error: "+error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    let newStore = new StoreProfile(store)
    newStore.save()
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
    }
    if(req.file){
        updatedStore.src = `https://gigvee.s3.us-east-2.amazonaws.com/${uuidv4()+req.body.filename.trim()}`

        fs.readFile(req.file.path, (err,data)=> {
            if(err) throw err;
            const s3 = new aws.S3();
            const s3Params = {
                Bucket: S3_BUCKET,
                Key: updatedStore.src.slice(42),
                Body: data,
                // Expires: 180,
                ContentType: req.file.mimetype,
                ACL: 'public-read'
              };
              s3.putObject(s3Params, function (s3Err,data) {
                if(s3Err) throw s3Err
               
                console.log('File uploaded successfully at --> '+ data.Location)
                fs.unlink(req.file.path, (err)=> {
                    if(err) console.log('Unable to delete used file '+ err)
                    else console.log('file deleted')
                })
              })
              
        })
    }
     //email
     var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gigveeteam@gmail.com',
            pass: 'JohnAlalade@4444'
        }
    });

    var mailOptions = {
        from: 'gigveeteam@gmail.com',
        to: req.body.email,
        subject: 'GigVee Store Update',
        html: `<h1> <strong>GigVee Store Update</strong> </h1>  <p>Hey! We are glad to inform you that you have successfully updated your store "${req.body.storename}" on Gigvee.</p> <p>Changes made have been recorded and will reflect on any new post you make .</p> <p>Here are  some useful tips you should try out</p> <ul> <li>As products will be deleted after 10 days, try posting a product every week</li> <li>Update your store only when neccesary</li> <li>Make sure your contact information are correct</li> <li>Be available to accept orders</li> </ul> <p>Kind regards..</p><quote>~John Alalade (Team Leader)</quote>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("Emailimg error: "+error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

   StoreProfile.findById(storeID)
    .then((data) => {
        if(req.body.checkerImage){
        if(data.src){  
         console.log(data.src)       
        const s3 = new aws.S3();
        const imgName = data.src.slice(42)
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