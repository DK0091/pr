import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    items:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],

    totalAmount: {
    type: Number,
    required: true,
    },

    status:{
        type:String,
        enum:["Pending", "Shipped", "Delivered", "Cancelled"],
        default:"Pending"
    },

    paymentStatus: {
    type: String,
    enum: ["Unpaid", "Paid"],
    default: "Unpaid",
    },
    razorpay_order_id:{
        type : String,
    },
    razorpay_payment_id:{
        type:String
    },
    razorpay_signature:{
        type:String
    }

},{timestamps:true})


export const Order = mongoose.model("Order",orderSchema);