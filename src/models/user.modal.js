import mongoose from "mongoose";
import Jwt  from "jsonwebtoken"; //this is our bearer token , this is like a key
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true //make the field more searchable in the database
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true //cloudnary service
    },
    coverImg:{
        type:String,
    },
    password:{
        type:String,
        required:[true , "Password is required"]
    },
    watchHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    refreshToken:{
        type:String
    }
} , {timestamps:true});


/* 
middleware : whatever user kuch bhi karna cha rha hai ussse just phele hum kuch karde tab .pre ka use hota hai
"Pre" means this function will execute before a user document is saved to the database.
 - next :  This is a critical parameter. It's a function you call to tell Mongoose it's okay to proceed to the next middleware function or to the actual saving operation itself
*/

userSchema.pre("save" , async function(next) { 
    if(!this.isModified("password")) return next(); // if the password has NOT been changed
    this.password = await bcrypt.hash(this.password , 10);
    next();
})

userSchema.method.isPassword = async function(password){
   return await bcrypt.compare(password , this.password); // boolean output.
}

userSchema.method.generateAccessToken = function(){
   return Jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET, //secret
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY //time
    }
    )
}

userSchema.method.generateRefresshToken = function(){
   return Jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}
export const User = mongoose.model("User" , userSchema);