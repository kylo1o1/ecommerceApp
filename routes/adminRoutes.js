const express = require('express')
const { authentication, authorization } = require('../middleware/auth')
const { viewSalesReport, updateOrderStatus, viewOrders } = require('../controller/adminController')
const { viewUsers } = require('../controller/userController')
const router = express.Router()

router.route('/users').get(authentication,authorization('admin'),viewUsers)
router.route('/salesReport').get(authentication,authorization('admin'),viewSalesReport)
router.route('/viewOrders').get(authentication,authorization('admin'),viewOrders)
router.route('/orderStatus/:orderId').post(authentication,authorization('admin'),updateOrderStatus)

module.exports = router