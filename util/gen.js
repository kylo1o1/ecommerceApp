const jwt = require('jsonwebtoken') 


exports.genToken = async (req,res) => {
    try {
        const {id,role} = req.user
        const options = {
            id,
            role,
            time:Date.now()
        }

        const token =  jwt.sign(options,process.env.SECRET_KEY,{expiresIn:"1hr"})

        if(!token){
            return res.status(400).json({
                success:false,
                message:"Login Failed"
            })
        }

        return res.status(201).cookie("token",token).json({
            success:true,
            message:"Login success",
            user:req.user,
            token
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
    
}