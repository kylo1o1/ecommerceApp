const { default: mongoose } = require("mongoose");
const Product = require("./productSchema");
const User = require("./userSchema");


const salesReportSchema = new mongoose.Schema({
    prodId:{
        type:mongoose.Types.ObjectId,
        ref:Product,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:User,
        required:true
    },
    quantitySold:{
        type:Number,
        required:true
    },

    revenue:{
        type:Number,
        required:true
    },
    saleDate:{
        type:Date,
        default:Date.now,
        required:true
    }


})

const SalesReport = mongoose.model('salesReport',salesReportSchema)

module.exports = SalesReport