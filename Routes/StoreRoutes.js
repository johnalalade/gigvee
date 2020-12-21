const express = require('express')
const storeRouter = express.Router()

const StoreController = require('../Controllers/StoreController')
const authenticate = require('../Middleware/authenticate')
const uploadMulter = require('../Middleware/upload.js')
const validation = require('../Middleware/validation.js')

storeRouter.post('/store/search', authenticate, StoreController.searchStore)
storeRouter.get('/store', authenticate, StoreController.indexStore)
storeRouter.post('/store/showone', authenticate, StoreController.showStore)
storeRouter.post('/store/addone', authenticate, StoreController.addStore)
storeRouter.post('/store/updateone', authenticate, StoreController.updateStore)
storeRouter.post('/store/deleteone', authenticate, StoreController.deleteStore)

module.exports = storeRouter

//uploadMulter,validation ,