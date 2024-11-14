const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Please Enter your name"]
    },
    email:{
        type:String,
        require:[true,"Please Enter your email Address"]
    },
    password:{
        type:String,
        require:[true,"Please Enter your password"]
    },
    role:{
        type:String,
        default:"user"
    }

})

const User = mongoose.model('user',userSchema)

module.exports = User