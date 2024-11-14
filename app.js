const cookieParser = require('cookie-parser')
const express = require('express')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const adminRoutes = require('./routes/adminRoutes')


const app = express()

app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use((err,req,res,next)=>{
    res.send(err.message)   
})
app.use(userRoutes)
app.use('/product',productRoutes)
app.use('/admin',adminRoutes)

module.exports = app