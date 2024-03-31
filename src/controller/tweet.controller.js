import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweetSchema.modal.js"
import { User } from "../models/user.modal.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { text } from "express"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    // body
    // content mai daal duga
    // aggregation pipeline kei through
    // verifyjwt ka use karke user lauga

    const { tweetContent } = req.body;
    if (!tweetContent) throw new ApiError(400, "Enter content in order to tweet")

    const user = await User.findById(req.user?._id);

    if(!user) throw new ApiError(404 , "user not found")

    const tweet = await Tweet.create({
        content:tweetContent,
        owner:user._id
    })

    if(!tweet) throw new ApiError(500 , "Can not create tweet");

    return res
    .status(200)
    .json(200 , tweet , "tweet generated successfully");
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const tweetUser = await Tweet.find({owner:req.user?._id});

    if(!tweetUser) throw new ApiError(400 , "user not found")
    return res
    .status(200)
    .json(200 , tweetUser , "userTweetFetched successfully")
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const{newContent} = req.body;
    const tweetUser = await Tweet.find({owner:req.user?._id});

    tweetUser.content = newContent;
    await tweetUser.save({ ValidateBeforeSave: false });

    return res
    .status(200)
    .json(200 , tweetUser , "tweet updated sucessfully")
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.param;
    const tweet = await Tweet.findOneAndDelete({
        _id:tweetId,
        owner:req.user?._id
    })

    if(!tweet) throw new ApiError("Tweet can't be deleted")
    
    return res
    .status(200)
    .json(200 , null , "tweet deleted successfully")
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}