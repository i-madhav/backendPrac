import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.modal.js"
import { Video } from "../models/video.modal.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { registerUser } from "./user.controller.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video
    const user = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    if (user) {
        await Like.deleteOne({
            video: videoId,
            likedBy: req.user?._id
        })
    }

    const likedNow = await Like.create({
        video: videoId,
        likedBy: req.user?._id
    })

    if (!likedNow.likedBy) throw new ApiError(401, "failed to like video");

    return res
        .status(200)
        .json(200, likedNow, "video liked successfully")
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment

    const existedUser = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    if (existedUser) {
        await Like.deleteOne({
            comment: commentId,
            likedBy: req.user?._id
        })
    }

    const likedNow = await Like.create({
        comment: commentId,
        likedBy: req.user?._id
    })

    if (!likedNow) throw new ApiError(401, "failed to like video");

    return res
        .status(200)
        .json(200, likedNow, "video liked successfully")
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    const existedUser = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if (existedUser) {
        await Like.deleteOne({
            tweet: tweetId,
            likedBy: req.user?._id
        })
    }

    const likedNow = await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if (!likedNow) throw new ApiError(401, "failed to like video");

    return res
        .status(200)
        .json(200, likedNow, "video liked successfully")
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userLikes = await Like.find({
        likedBy:req.user?._id
    })
   const videoId =  userLikes.map(likeObject => likeObject.video)

   const video = Video.find({
    owner:videoId
   })
   
    return res.
    status(200)
    .json(200 , video , "liked vidoe fetched successfully")
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}