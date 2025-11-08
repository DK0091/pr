import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    username : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "paid",
  },

},{timestamps:true})

export  const Payment = mongoose.model("Payment",paymentSchema)