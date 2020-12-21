const express = require('express')
const ProductsRouter = express.Router()

const ProductsController = require('../Controllers/productsController')
const authenticate = require('../Middleware/authenticate')
const uploadMulter = require('../Middleware/upload.js')
const validation = require('../Middleware/validation.js')

ProductsRouter.post('/products/search', authenticate, ProductsController.searchProducts)
ProductsRouter.post('/products/myproducts', authenticate,ProductsController.myProducts)
ProductsRouter.post('/products', authenticate, ProductsController.indexProducts)
ProductsRouter.post('/products/showone', authenticate,ProductsController.showProduct)
ProductsRouter.post('/products/addone',authenticate, ProductsController.addProduct)
ProductsRouter.post('/products/updateone', authenticate,ProductsController.updateProduct)
ProductsRouter.post('/products/deleteone',authenticate, ProductsController.deleteProduct)


module.exports = ProductsRouter

//uploadMulter,validation,