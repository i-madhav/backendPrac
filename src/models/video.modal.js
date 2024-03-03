import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new mongoose.Schema({
    videofile:{
        type:String, //cloudnary upload
        required:true
    },
    thumbnail:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number, //will retrive from cloudnary 
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
} , {timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate) //mongoose aggrigation pipeline
export const Video = mongoose.model("Video" , videoSchema)