const express = require('express')
const ProductsRouter = express.Router()

const ProductsController = require('../Controllers/productsController')
const authenticate = require('../Middleware/authenticate')
const uploadMulter = require('../Middleware/upload.js')
const validation = require('../Middleware/validation.js')

ProductsRouter.post('/products/search', ProductsController.searchProducts)
ProductsRouter.post('/products/myproducts', ProductsController.myProducts)
ProductsRouter.post('/products', ProductsController.indexProducts)
ProductsRouter.post('/products/showone', ProductsController.showProduct)
ProductsRouter.post('/products/addone',uploadMulter,validation,ProductsController.addProduct)
ProductsRouter.post('/products/updateone',uploadMulter,validation,ProductsController.updateProduct)
ProductsRouter.post('/products/deleteone',ProductsController.deleteProduct)


module.exports = ProductsRouter