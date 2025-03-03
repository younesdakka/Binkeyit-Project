const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()


if(!process.env.MONGODB_URL){
    throw new Error("please provide MONGO_URL in the .env file")
}

async function connectDB() {
    try {
       const data = await mongoose.connect(process.env.MONGODB_URL)

    }catch (error){
        console.log('mongodb connect error',error);
        process.exit(1)
        
    }
}
module.exports = connectDB;
