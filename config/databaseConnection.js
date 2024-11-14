const { default: mongoose } = require("mongoose")


const databaseConnection = ()=>{
    mongoose.connect(process.env.DB_URL)
    .then((data)=>{
        console.log(`Connection Established With ${data.connection.host}`)
        
    })
    .catch((err)=>{
        console.log(err.message);
        
    })
}

module.exports = databaseConnection