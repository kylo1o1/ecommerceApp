const Orderhistory = require("../models/orderHistorySchema")
const Product = require("../models/productSchema")
const SalesReport = require("../models/salesReport")

exports.viewSalesReport = async (req,res) => {
    try {
        const sales = await SalesReport.find()

        if(!sales || sales.length === 0){
            return res.status(404).json({
                success:false,
                message:"No Report yet"
            })
        }

        const report = await Promise.all(sales.map(async (e)=>({
            id:e._id,
            product : await Product.findById(e.prodId).then(ele=> ele?.pName ?? ''),
            quantiySold : e.quantitySold,
            revenue : e.revenue,
            date:e.saleDate
        })))

        return res.status(200).json({
            success:true,
            report
        })

    } catch (error) {
        return res.status(500).json({
                success:false,
                message:"Server Error",
                error:error.message
            })
    }
}
exports.updateOrderStatus = async (req,res) => {
    try {
        const {orderId} = req.params
        const {status} = req.body
        const order = await Orderhistory.findById(orderId)

        if(!order){
            return res.status(404).json({
                success:true,
                message:"Order not Found"
            })
        }

        order.status = status
        order.save()
        res.status(200).json({
            success:true,
            message:"Status updated"
        })

    } catch (error) {
        return res.status(500).json({
                success:false,
                message:"Server Error",
                error:error.message
            }) 
    }
}
exports.viewOrders  = async (req,res) => {
    try {
        const orders = await Orderhistory.find({status:{$ne:"delivered"}}) 
        if(!orders){
            return res.status(404).json({
                success:false,
                message:"No orders Found"
            })
        }

        const allOrders = await Promise.all(orders.map(async (e)=>({
            id:e._id,
            product: await Product.findById(e.prodId).then(el=>el.pName),
            quantiy:e.quantity,
            amount:e.amount,
            status:e.status

        })))

        return res.status(200).json({
            success:true,
            allOrders
        })

    } catch (error) {
        return res.status(500).json({
                success:false,
                message:"Server Error",
                error:error.message
            })
    }
}