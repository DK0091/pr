import Apiresponse from "../utils/apiresponse.js"
import { instancerazorpay } from "../config/razorpay.config.js";
import asyncHandler from "../utils/asynchandler.js";
import crypto from "crypto"
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";


const createOrder = asyncHandler(async (req, res) => {
  const { amount, items } = req.body;

  const order = await Order.create({
    user: req.user._id,
    items,
    totalAmount: amount,
    paymentStatus: "Pending",
  });

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: order._id.toString(),
  };

  const razorpayOrder = await instancerazorpay.orders.create(options);

  
  order.razorpay_order_id= razorpayOrder.id;
  await Order.save();

  return res.status(200).json(
    new Apiresponse(200, { order, razorpayOrder }, "Razorpay Order Created")
  );

});


const verifypayment = asyncHandler(async(req,res)=>{
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount} = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id

      const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex")

       const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        
        const payment = await Payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount: amount, 
          user: req.user?._id, 
          status : "paid"
        });

        const order = await Order.findOne({razorpay_order_id});

        if(order){
          order.paymentStatus = "Paid"
          order.razorpay_order_id = razorpay_order_id;
          order.razorpay_payment_id = razorpay_payment_id;
          order.razorpay_signature = razorpay_signature;
          await Order.save();
        }
        

        return res.status(200).json(
          new Apiresponse(200, payment, "Payment Verified & Saved")
        );
      } else {
        return res.status(400).json(
          new Apiresponse(400, null, "Invalid Signature, Payment Failed")
        );
      }
    });


export {createOrder,verifypayment}