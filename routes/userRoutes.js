const express = require('express')
const { userRegister, login, updateProfile, viewProfile, deleteProfile,  previousOrder, orderStatus } = require('../controller/userController')
const { authentication, authorization } = require('../middleware/auth')
const router = express.Router()

router.route('/register').post(userRegister)
router.route('/login').post(login)
router.route('/profile/:pid')
        .get(authentication,viewProfile)
        .put(authentication,updateProfile)
        .delete(authentication,deleteProfile)

router.route('/orderHistory/:pid').get(authentication,previousOrder)
router.route('/orderStatus/:orderId').get(authentication,orderStatus)


module.exports = router
