const { default: mongoose } = require("mongoose");
const Product = require("./productSchema");
const User = require("./userSchema");

const orderHistorySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:User
    },
    prodId : {
        type:mongoose.Types.ObjectId,
        ref:Product
    },
    quantity:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:'pending',
    },
    orderDate:{
        type:Date,
        default:Date.now,
        required:true

    }

})

const Orderhistory =  mongoose.model('Order',orderHistorySchema)

module.exports = Orderhistory
