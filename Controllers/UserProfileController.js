const UserProfile = require('../Models/UserProfileModel')

// show list of all available User

const indexProfile = (req, res, next) => {
    UserProfile.find()
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

// show one  user profile

const showProfile = (req, res, next) => {
    let userID = req.body.userID
    UserProfile.findById(userID)
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
// add user profile

const storeProfile = (req, res, next) => {
    let user = new UserProfile({
        _id: req.body.id,
        name: req.body.phone,
        email: req.body.email,
        phone: req.body.phone,
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

// update profile
const updateProfile = (req, res, next) => {

    let userID = req.body.userID

    let updatedProfile = {
        _id: req.body.id,
        name: req.body.phone,
        email: req.body.email,
        phone: req.body.phone,
        bookmarks: bookmarks.unShift(req.body.bookmark),
        notifications: notifications.unShift(req.body.notifications)
    }
    if(req.file){
        updatedProfile.avatar = req.file.path
    }
    UserProfile.findByIdAndUpdate(userID, {$set: updatedProfile})
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

// delete profile

const deleteProfile = (req, res, next) => {
    let userID = req.body.userID
    UserProfile.findByIdAndRemove(userID)
    .then(() => {
        res.json({
            message: "Account Deleted"
        })
    })
    .catch(() => {
        res.json({
            message: "An Error Occured"
        })
    })
}

module.exports = {
    indexProfile, showProfile, updateProfile, deleteProfile, storeProfile
}