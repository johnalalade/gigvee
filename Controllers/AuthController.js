const Login = require('../Models/loginModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const aws = require('aws-sdk');

const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-east-2'
//const uploadPath = path.join('public', Login.imageBasePath)
require('dotenv').config();

// show list of all available User
const indexProfile = (req, res, next) => {
    Login.find()
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

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
        if(err) {
            res.json({
                error: err
            })
        }

        let login = new Login ({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPass
        })
        login.save()
        .then(user => {
            
            res.json({
                message: "Login Successful",
                id: user._id
            })
        })
        .catch(error => {
            res.json({
                message: "An Error Occured!"
            })
        })
    })

    
}

const login = (req, res, next)=> {
    var userName = req.body.userName
    var password = req.body.password

    Login.findOne({$or: [{email:userName}, {phone:userName}]})
    .then(user => {
    
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err) {
                    res.json({
                        error: err
                    })
                }
                if(result) {
                    let token = jwt.sign({name: user.name},"Iyaaduke+5")
                    console.log(user)
                    res.json({
                        message: "Login Succesful",
                        token,
                        id: user._id
                    })
                }else{
                    res.json({
                        message: "Password Does Not Match!"
                    })
                }
            })
        }else{
            res.json({
                message: "No User Found"
            })
        }
    })
}

// show one 
const showOne = (req, res, next) => {
    let userID = req.body.userID 
    Login.findById(userID)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            error,
            message: "Can't Find User"
        })
    })

}

// add user profile

const storeProfile = (req, res, next) => {
    let user = new Login({
        _id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        bookmarks: bookmarks.unShift(req.body.bookmark),
        notifications: notifications.unShift(req.body.notifications)
    })
    if(req.file){
        user.avatar = req.file.path
    }
    user.save()
    .then(response => {
        res.json({
            message: "User Profile Added Succecfully"
        })
    })
    .catch(error => {
        res.json({
            message: "An Error Occured"
        })
    })
}

const updateProfile = (req, res, next) => {

    let userID = req.body.userID

    let updatedProfile = { 
        src: req.body.src,
        bookmarks: [],
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
    }
    Login.findById(userID)
    .then((data) => {
        if(data.src){
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
          else{return}
         
    })
    .then(() => {
        Login.findByIdAndUpdate(userID, {$set: updatedProfile})
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
    })
    .catch((err) => console.log(err))
   
     
}
        
    

module.exports = {
    register, login, showOne, storeProfile, updateProfile, indexProfile
}

// {expiresIn: '24h'}