const { default: mongoose } = require("mongoose");
const User = require("./userSchema");

const productSchema = new mongoose.Schema({
    pName:{
        type:String,
        require:[true,"Please Enter Products Name"]
    },
    pDesc:{
        type:String,
        require:[true,"Please Enter Products Description"]
    },
    pPrice:{
        type:Number,
        require:[true,"Please Enter Products price"]
    },
    pQuantity:{
        type:Number,
        require:[true,"Please Enter Products Quantity"]
    },
    uid:{
        type:mongoose.Types.ObjectId,
        ref:User
    },
    addedAt:{
        type:Date,
        default:Date.now,
        required:true
    }
})

const Product = mongoose.model('product',productSchema)

module.exports = Product