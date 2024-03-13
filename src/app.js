import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true 
}))

//configuration
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true , limit:"15kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes
import userRouter from "./routes/user.routes.js";

// route declaration
// router ko lane kei liye middleware lana padega 
//"For any incoming HTTP requests whose path starts with /api/v1/users, delegate the handling of those requests to the userRouter."
app.use("/api/v1/users" , userRouter)
    
//http://localhost:8000/api/v1/users/register
export {app};