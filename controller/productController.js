const Product = require("../models/productSchema")
const User = require("../models/userSchema")


exports.productRegister = async (req,res) => {
    try {
        const {pName, pDesc,  pPrice, pQuantity} = req.body
        const {id} = req

        if(
            !pName ||
            !pDesc ||  
            !pPrice ||
            !pQuantity
        ){
            return res.status(400).json({
                success:false,
                message:"Please Enter All fields"
            })
        }

        const product = await Product.create({
            pName,
            pDesc,
            pPrice,
            pQuantity,
            uid:id
        })

        if(!product){
            return res.status(400).json({
                success:false,
                message:"Product registration Failed"
            })
        }

        return res.status(201).json({
            success:true,
            message:"Product Registered"
        })
    } catch (error) {
         return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}

exports.viewProducts = async (req,res) => {
    try {
        const products =  await Product.find()
        
        if(!products){
            return res.status(404).json({
                success:false,
                message:"No Products Found"
            })
        }

        

        return res.status(200).json({
            success:true,
            products
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}

exports.viewSingleProduct = async (req,res) => {
    try {
        const {prodId} = req.params
        
        const product = await Product.findById(prodId)

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product Not Found"
            })
        }

        const seller = await User.findById(product.uid)

        if(!seller){
            res.status(404).json({
                success:false,
                message:"This product is not available anymore"
            })
        }

        return res.status(200).json({
            success:true,
            product:{
                name : product.pName,
                description : product.pDesc,
                price : product.pPrice,
                quantity : product.pQuantity,
                seller :  seller.name,

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

exports.updateProduct = async (req,res) => {
    try {       
        const {id,role} = req
        const {prodId} = req.params

        const product = await Product.findById(prodId)
        
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product Not Found"
            })
        }

        console.log(id,product.uid);
        

        if(  product.uid.toString() !== id && role !=='admin'){
            return res.status(403).json({
                success:false,
                message:"You Don't have the authority to update this product"
            })
        }
        
        const uProduct = await Product.findByIdAndUpdate(prodId,req.body)

        if(!uProduct){
            return res.status(400).json({
                success:false,
                message:"Product updation Failed"
            })
        }

        uProduct.save()

        return res.status(200).json({
            success:true,
            message:"Product Updated"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}


// return res.status(500).json({
//     success:false,
//     message:"Server Error",
//     error:error.message
// })