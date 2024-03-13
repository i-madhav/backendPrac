import { User } from "../models/user.modal.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
     console.log("This is my Token", token);
 
     if (!token) throw new ApiError(401, "Unauthorized access");
 
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

     const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

     if (!user) throw new ApiError(401, "Invalid accessToken");
     
     req.user = user; //created a object called user and gave it access to our user which got from "decodedToken?._id"
     next();
   } catch (error) {
    throw new ApiError(401 , error?.message || "Invalid Token");
   }
})