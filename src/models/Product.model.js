import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    comment:{
        type:String
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    }
},{timestamps:true})

const ProductSchema = new mongoose.Schema({
    
    name : {
        type:String,
        required:true,
        trim: true,
    },
    stock:{
        type:Number,
        required:true,
        default:0
    },
    description:{
        type:String,
        required:true
    },
      category: {
        type: String,
        required: true,
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String
    }, 
    seller : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[reviewSchema],

    numReviews: { 
        type: Number, 
        default: 0
    },
      rating:{ 
        type: Number, 
        default: 0 
    }

},{timestamps:true})

export const Product = mongoose.model("Product",ProductSchema)



