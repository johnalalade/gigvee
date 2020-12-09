const express = require('express')
const profileRouter = express.Router()

const UserProfileController = require('../Controllers/UserProfileController')
const upload = require('../Middleware/upload')

profileRouter.get('/userProfile', UserProfileController.indexProfile)
profileRouter.post('/userProfile/showone', UserProfileController.showProfile)
profileRouter.post('/userProfile/storeone', upload.single('avatar'), UserProfileController.storeProfile)
profileRouter.post('/userProfile/updateone', upload.single('avatar'), UserProfileController.updateProfile)
profileRouter.post('/userProfile/deleteone', UserProfileController.deleteProfile)

module.exports = profileRouter



