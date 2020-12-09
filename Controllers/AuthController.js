const Login = require('../Models/loginModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
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
                    let token = jwt.sign({name: user.name},"Iyaaduke+5", {expiresIn: '24h'})
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

const updateProfile = async (req, res, next) => {

    let userID = req.body.userID

    let updatedProfile = { 
        bookmarks: []
    }
    if(req.body.firstname){
        updatedProfile.firstname = req.body.firstname 
    }
    if(req.body.lastname){
        updatedProfile.lastname = req.body.lastname 
    }
    if(req.body.email){
        updatedProfile.email = req.body.email 
    }
    if(req.body.phone){
        updatedProfile.phone = req.body.phone 
    }
    if(req.body.password){
        updatedProfile.password = req.body.password 
    }
    if(req.body.bookmark){
        updatedProfile.bookmarks = updatedProfile.bookmarks.push(req.body.bookmark) 
    }
    if(req.body.notification){
        updatedProfile.notifications = updatedProfile.notifications.unShift(req.body.notification) 
    }
     if(req.file){
          updatedProfile.image = req.file.path
      }
    if(req.body.filename){
        updatedProfile.filename = req.body.filename 
    }

      //saveImage(updatedProfile, req.body.files)
    Login.findById(userID)
    .then(response => {
        fs.unlink(`${response.image}`,(err) => {
            if(err) console.log(err)
            else console.log('file deleted')
        })
    })
    .then(() => {
        Login.findByIdAndUpdate(userID, {$set: updatedProfile})
        .then((datab) => {
            res.json({
                datab,
                message: "Profile Updated Successfully"
            })
        })
        .catch(error => {
            console.log(error)
            res.json({
                error,
                message: "An Error Occured"
            })
        })
  
    })
    .catch(err => {
        res.json({
            message: "Minor Error Occured"
        })
    })
      
      
    
}
        
    
   
// function saveImage(Profile, img ) {
//     if(img == null) return
//     const cover = img
//     const imagesMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
//     if (cover != null && imagesMimeTypes.includes(cover.type)){
//         Profile.image = new Buffer.from(cover.data, 'base64')
//         Profile.imageType = cover.type
//     }
// }

module.exports = {
    register, login, showOne, storeProfile, updateProfile, indexProfile
}