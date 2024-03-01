import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () =>{
    try{
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`\n MongoDb Connected ! DB_Host : ${connectionInstance.connection.host}`);
    }catch(error){
        console.log("Error couldn't connect to the Database" , error);
        process.exit(1);
    }
}

export default connectDB;