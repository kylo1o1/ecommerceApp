const bcrypt = require('bcrypt')
const User = require('../models/userSchema')
const { genToken } = require('../util/gen')
const Product = require('../models/productSchema')
const Orderhistory = require('../models/orderHistorySchema')
const SalesReport = require('../models/salesReport')


exports.userRegister = async (req,res) => {
    try {
        const {name, email, password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are Required"
            })
        }
        const isExist = await User.findOne({email})

        if(isExist){
            return res.status(400).json({
                success:false,
                message:"An Account with this Email address already Exists"
            })
        }

        const user = await User.create({
            name,
            email,
            password : await bcrypt.hash(password,10)
        })

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Registration Failed"
            })
        }

       return  res.status(201).json({
            success:true,
            message:"Registration Successfull",
            reg:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}

exports.login = async (req,res) => {
    try {
        const {email,password} = req.body
        
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please Enter your email and password"
            })
        }

        const log = await User.findOne({email})

        if(!log){
            return res.status(404).json({
                succes:false,
                message:"No Account is register with this email address"
            })
        }

        const isMatch =  bcrypt.compare(password,log.password)

        if(!isMatch){
            return res.status(400).json({
                succes:false,
                message:"Please Enter a valid Email and password"
            })
        }

        const user = {
            id : log._id,
            email : log.email,
            name : log.name,
            role : log.role
        }

        req.user = user

        genToken(req,res)

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}

exports.viewProfile = async (req,res) => {
    try {
        const {pid} = req.params
        const user = await User.findById(pid)

        if(!user){
            return res.status(404).json({
                success:false,
                message:"Account not found"
            })
        }

        return res.status(200).json({
            succes:true,
            user:{
                name:user.name,
                email:user.email,
            }
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}

exports.updateProfile = async (req,res) => {
    try {
        const {pid} = req.params
        const {id} = req

        // const {name,email,password} = req.body

        // if(!id){
        //     return res.status(404).json({
        //         success:false,
        //         message:""
        //     })
        // }

        if(pid !== id){
            return res.status(403).json({
                succes:false,
                message:"You Don't have the authority to perform this task"
            })
        }

        const user = await User.findById(id)

        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not Found"
            })
        }

        const updateUser = await User.findByIdAndUpdate(id,req.body)
        
        if(!updateUser){
            return res.status(400).json({
                success:false,
                message:"Updation failed"
            })
        }
        updateUser.save()

        return res.status(200).json({
            succes:true,
            message:"Profile Updated"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}

exports.deleteProfile = async (req,res) => {
    try {
        
        const {pid} = req.params
        const {id}   = req

        if(pid !== id){
            return res.status(403).json({
                succes:false,
                message:"You Don't have the authority to perform this task"
            })
        }

        const user = await User.findByIdAndDelete(pid)

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Profile Deletetion Failed"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Profile Deleted"
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}

exports.viewUsers = async (req,res) => {
    try {
        
        const users = await User.find({role:'user'})

        if(!users){
            return res.status(404).json({
                succes:false,
                message:"No user Found"
            })
        }

        return res.status(200).json({
            success:true,
            users
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}

exports.buyProduct = async (req,res) => {
    try {
        const {prodId} = req.params
        const {id} = req
        const {quantity } = req.body

        const product = await Product.findById(prodId)

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product Not Found"
            })
        }

        if(product.pQuantity === 0){
            return res.status(400).json({
                success:false,
                message:"This product is out of Stock"
            })
        }


        product.pQuantity = product.pQuantity - quantity
        const amount = (quantity * product.pPrice)

        console.log(amount.to);
        
        const uProduct = await product.save()
        
        if(!uProduct){
            return res.status(400).json({
                success:false,
                message:"Purchase failed"
            })
        }

        const order = await Orderhistory.create({
            userId:id,
            prodId ,
            quantity:quantity,
            amount
        })
    

        const sales = await SalesReport.create({
            prodId, 
            userId:id,
            quantitySold:quantity,
            revenue:amount
        })

        if(!order || !sales){
            return res.status(400).json({
                success:false,
                message:"Purchase failed"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Purchase success"
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.stack
        })
    }
}

exports.previousOrder = async (req,res) => {
    try {
        const {pid} = req.params
        
        const orders = await Orderhistory.find({userId:pid,status:'delivered'})

        if(!orders || orders.length === 0  ){
            return res.status(404).json({
                success:false,
                message:"So empty"
            })
        }

         const order = await Promise.all(orders.map( async (element) =>({
            id:element._id,
            product : await Product.findById(element?.prodId ?? null).then((e)=> e?.pName?? null),
            quantity : element.quantity,
            amount : element.amount,
            status:element.status
         })
         ))


        return res.status(200).json({
            success:true,
            order
        })

        
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:"Server Error",
                error:error.message
            })
    }
}

exports.orderStatus = async (req,res) => {
    try {
        const{orderId} = req.params
        
        const order = await Orderhistory.findById(orderId)

        if(!order){
            return res.status(404).json({
                success:true,
                message:"Order Not FOund"
            })
        }
        

        return res.status(200).json({
            success:true,
            status:order.status
        })



    } catch (error) {
        
    }
}
