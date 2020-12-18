const express = require('express')
const storeRouter = express.Router()

const StoreController = require('../Controllers/StoreController')
const authenticate = require('../Middleware/authenticate')
const uploadMulter = require('../Middleware/upload.js')
const validation = require('../Middleware/validation.js')

storeRouter.post('/store/search', StoreController.searchStore)
storeRouter.get('/store', StoreController.indexStore)
storeRouter.post('/store/showone', StoreController.showStore)
storeRouter.post('/store/addone', StoreController.addStore)
storeRouter.post('/store/updateone', StoreController.updateStore)
storeRouter.post('/store/deleteone', StoreController.deleteStore)

module.exports = storeRouter

//uploadMulter,validation ,