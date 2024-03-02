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
        type:true
    }
} , {timestamps:true});


//middleware
userSchema.pre("save" , async function(next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password , 10)
    next()
})

userSchema.method.isPassword = async function(password){
   return await bcrypt.compare(password , this.password);
}


userSchema.method.generateAccessToken = function(){
   return Jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
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