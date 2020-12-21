const express = require('express')
const auther = express.Router()

const AuthController = require('../Controllers/AuthController')
const authenticate = require('../Middleware/authenticate')
const uploadMulter = require('../Middleware/upload.js')
const validation = require('../Middleware/validation.js')


auther.post('/register', AuthController.register)
auther.post('/login', AuthController.login)
auther.get('/profiles', authenticate, AuthController.indexProfile)
auther.post('/profiles/showone', authenticate,AuthController.showOne)
auther.post('/profiles/updateone', authenticate, AuthController.updateProfile)
auther.post('/profiles/storeone', authenticate, AuthController.storeProfile)

module.exports = auther

