const jwt = require('jsonwebtoken')


exports.authentication = async (req,res,next) => {
    try {
        const {token} = req.cookies
        
        if(!token){
            return res.status(404).json({
                success:false,
                message:"Token TimedOut"
            })
        }

        jwt.verify(token,process.env.SECRET_KEY,(error,decode)=>{
            if(error){                
                return res.status(400).json({
                    success:false,
                    message:"Token_ERR",
                    error:error.message
                })
            }

            req.id = decode.id
            req.role = decode.role
            next()
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })   
    }
}

exports.authorization = (...roles) => {
    try {
        return (req,res,next)=>{
            const {role} = req
            if(!roles.includes(role)){
                return res.status(403).json({
                    success:false,
                    message:"Unauthorized Access"
                })
            }
            next()

        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}