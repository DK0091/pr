import mongoose, { model } from "mongoose";


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
    rating:{ 
        type: Number, 
        default: 0 
    },
    numReviews: { 
        type: Number, 
        default: 0 }, 
    seller : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    }  



},{timestamps:true})

export const Product = mongoose.model("Product",ProductSchema)



