import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import { User } from "../models/user.modal.js";
import {uploadOnCloudnary} from "../utils/cloudnaryFileUpload.js"
import { ApiResponse } from "../utils/apiresponse.js";

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

    if(!username || !email || !fullname || !password){
        throw new ApiError(400 , "Field is empty ! ")
    }

    // validation
    
    if([username , email , fullname , password].some((field) => !field?.trim())){
        throw new ApiError(400 , "Field is empty. All Fields are required!")
    }

    let mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(!email.value.match(mailformat)){
        alert("Email Wrong !")
    }

    const existedUser = User.findOne({ // will return the first user with the email or username given
        $or:[{ username } , { email }]
    })

    if(existedUser) throw new ApiError(409 , "User already existed");

  const avatarLocalPath =  req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath) throw new ApiError(400 , "Avtar is necessary");

  const avatar = await uploadOnCloudnary(avatarLocalPath);
  const coverImage = await uploadOnCloudnary(coverImageLocalPath);

  if(!avatar) throw new ApiError(400 , "Avatar not available");

 const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })

  const createdUser =  await User.findById(user._id).select(  // checking if the user exist by the given user id.
    "-password -refreshToken"  // unique syntax 
  )

  if(!createdUser) throw new ApiError(500 , "Something went wrong while registering user");

  return res.status(201).json(
    new ApiResponse(200 , createdUser , "User registered successfully")
  )
  
})

export {registerUser}