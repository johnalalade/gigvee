const express = require('express')
const storeRouter = express.Router()

const StoreController = require('../Controllers/StoreController')
const authenticate = require('../Middleware/authenticate')
const uploadMulter = require('../Middleware/upload.js')
const validation = require('../Middleware/validation.js')

storeRouter.post('/store/search', authenticate, StoreController.searchStore)
storeRouter.post('/store', authenticate, StoreController.indexStore)
storeRouter.post('/store/showone', authenticate, StoreController.showStore)
storeRouter.post('/store/addone',uploadMulter, authenticate, StoreController.addStore)
storeRouter.post('/store/updateone',uploadMulter, authenticate, StoreController.updateStore)
storeRouter.post('/store/deleteone', authenticate, StoreController.deleteStore)
storeRouter.post('/store/comment', authenticate, StoreController.commenting)

module.exports = storeRouter

//uploadMulter,validation ,