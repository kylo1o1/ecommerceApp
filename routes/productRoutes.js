const express = require('express')
const { authentication, authorization } = require('../middleware/auth')
const { productRegister, viewProducts, viewSingleProduct, updateProduct } = require('../controller/productController')
const { buyProduct } = require('../controller/userController')
const router = express.Router()


router.route('/productRegister').post(authentication,authorization('admin','seller'),productRegister)

router.route('/viewProducts').get(authentication,viewProducts)

router.route('/:prodId')
    .get(authentication,viewSingleProduct)
    .put(authentication,authorization('admin','seller'),updateProduct)
    .post(authentication,buyProduct)
    

module.exports = router
