import asyncHandler from "../utils/asynchandler.js"
import { Order } from "../models/order.model.js";
import { Product } from "../models/Product.model.js";
import Apierror from "../utils/apierror.js";
import Apiresponse from "../utils/apiresponse.js";
import { User } from "../models/user.model.js";
import { sendmail } from "../utils/mailer.js";

const buyNow = asyncHandler(async(req,res)=>{
    const {productId} = req.params;
    const userId = req.user._id;
    const quantity = 1;

    const product = await Product.findById(productId);
    if(!product){
        throw new Apierror(404,"Product not found")
    }

    if(product.stock < quantity){
        throw new Apierror(400,`${product.name} is not in stock`)
    }

    const order = await Order.create({
        user: userId,
        items: [{product: productId, quantity: quantity}],
        totalAmount: product.price * quantity,
        status: "Pending"
    });

    product.stock -= quantity;
    await product.save();

    return res.status(200).json({
        statusCode: 200,
        data: order,
        message: "Order placed successfully",
        success: true
    });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate("items.product", "name price image")
    .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    return res.status(200).json(new Apiresponse(200, [], "No orders found"));
  }

  return res
    .status(200)
    .json(new Apiresponse(200, orders, "User orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, user: userId })
    .populate("items.product", "name price image description");

  if (!order) throw new Apierror(404, "Order not found");

  return res
    .status(200)
    .json(new Apiresponse(200, order, "Order details fetched successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new Apierror(404, "Order not found");

  if (order.status === "Shipped" || order.status === "Delivered") {
    throw new Apierror(400, "You cannot cancel this order now");
  }

  order.status = "Cancelled";
  await order.save();

 
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  return res
    .status(200)
    .json(new Apiresponse(200, order, "Order cancelled successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "username email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new Apiresponse(200, orders, "All orders fetched successfully"));
});

 const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; 

  const order = await Order.findById(orderId);
  if (!order) throw new Apierror(404, "Order not found");

  order.status = status;
  await order.save();

  return res
    .status(200)
    .json(new Apiresponse(200, order, "Order status updated successfully"));
});


export {updateOrderStatus,buyNow,getAllOrders,getMyOrders,getOrderById,cancelOrder}

