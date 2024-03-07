import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";

const registerUser = asyncHandler(async (req , res) =>{
   // get user details from the frontend
   //validation : if not empty
   // check if already exist  : username , email
   //check for images , avatar
   //upload them in cloudinary , avtar
   // create user object coz mongodb ia a noSQL database . 
   // remove password and referesh token field
   // check for user creation - if yes
   // return response 


    const {username , email , fullname , password}= req.body;

    /*if(!username || !email || !fullname || !password){
        throw new ApiError(400 , "Field is empty ! ")
    }*/

    // validation
    if([username , email , fullname , password].some((field) => !field?.trim())){
        throw new ApiError(400 , "Field is empty ! ")
    }
    let mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(!email.value.match(mailformat)){
        alert("Email Wrong !")
    }

})

export {registerUser}