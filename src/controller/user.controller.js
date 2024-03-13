import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.modal.js";
import { uploadOnCloudnary } from "../utils/cloudnaryFileUpload.js"
import { ApiResponse } from "../utils/apiresponse.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefresshToken();

    user.refreshToken = refreshToken;
    await user.save({ ValidateBeforeSave: false });

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Could not generate referesh token and access token");
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // get user details from the frontend
  //validation : if not empty
  // check if already exist  : username , email
  //check for images , avatar
  //upload them in cloudinary , avtar
  // create user object coz mongodb ia a noSQL database . 
  // remove password and referesh token field
  // check for user creation - if yes
  // return response 


  const { username, email, fullname, password } = req.body;

  /* if(!username || !email || !fullname || !password){
       throw new ApiError(400 , "Field is empty ! ")
   }*/

  // validation

  if ([username, email, fullname, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "Field is empty. All Fields are required!")
  }

  const existedUser = await User.findOne({ // will return the first user with the email or username given
    $or: [{ username }, { email }]
  })

  if (existedUser) throw new ApiError(409, "User already existed");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  /*let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.file.coverImage.length > 0) {
   coverImageLocalPath =  req.files.coverImage[0].path
  }*/

  if (!avatarLocalPath) throw new ApiError(400, "Avtar is necessary");

  const avatar = await uploadOnCloudnary(avatarLocalPath);
  const coverImage = await uploadOnCloudnary(coverImageLocalPath);
  console.log(avatar);
  console.log(coverImage);

  if (!avatar) throw new ApiError(400, "Avatar not available");

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(  // checking if the user exist by the given user id.
    "-password -refreshToken"  // unique syntax 
  )

  if (!createdUser) throw new ApiError(500, "Something went wrong while registering user");

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )

})

const loginUser = asyncHandler(async (req, res) => {
  // get detail : email and password
  // check if user exist karta of email and validate the password
  // check user not exist error show and kahuga register first
  // access token deduga
  //refereh token
  //send cookie

  const { username, email, password } = req.body;
  console.log(email);
  console.log(username);
  if (!username && !email) throw new ApiError(400, "username or email is required");

  const user = await User.findOne({
    $or: [{ email }, { username }]
  })

  if (!user) throw new ApiError(400, "User or email doesn't exist");

  const isPasswordValid = await user.isPasswordValid(password);

  if (!isPasswordValid) throw new ApiError(401, "Password invalid");

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id); // yaha is operation mai time lag sakta hai !
  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken") // these are the fields i dont't want to send to my client

  const options = { // by doing this your cookies is only modifilable on the server side not frontend side
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser, accessToken, refreshToken
      },
        "user logged in successfully"
      )
    )
})

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true // this will make sure i have updated field in response
    }
  )


  const options = { // by doing this your cookies is only modifilable on the server side not frontend side
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User loggedOut"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
  
try {
    const inComingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!inComingRefreshToken) throw new ApiError(401, "Unauthorized request");
  
    const decodedToken = jwt.verify(inComingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken?._id);
    if (!user) throw new ApiError(401, "Invalid refresh Token");
  
    if (inComingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token expired")
    }
  
    const options = { // by doing this your cookies is only modifilable on the server side not frontend side
      httpOnly: true,
      secure: true
    }
  
    const { accessToken, newrefreshToken } = await generateAccessTokenAndRefreshToken(user._id)
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(200,
          { accessToken, refreshToken: newrefreshToken },
          "AccessToken Refreshed successfully"
        )
      )
  
} catch (error) {
  throw new ApiError(401 , error?.message || "Invalid token")
}
})

const changeCurrentUserPassword = asyncHandler(async(req , res) => {
  const{oldPassword , newPassword} = req.body;
  const user = await User.findById(req.user?._id)

 const isPasswordCorrect =  await user.isPasswordValid(oldPassword);
 if(!isPasswordCorrect) throw new ApiError(400 , "Invalid password");

 user.password = newPassword;
 await user.save({ValidateBeforeSave:false});

 return res
 .status(200)
 .json(new ApiResponse(200 , {} , "Password Changes Successfully"))
 
});

export { registerUser, loginUser, logOutUser ,refreshAccessToken}