import { Cart } from "../models/cart.model.js";
import Apiresponse from "../utils/apiresponse.js";
import asyncHandler from "../utils/asynchandler.js";
import Apierror from "../utils/apierror.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/Product.model.js";
import { sendmail } from "../utils/mailer.js";
import {User} from "../models/user.model.js"



const addtocart = asyncHandler(async(req,res)=>{
    const productId = req.params.id;
    const userId = req.user._id;
    const { quantity = 1 } = req.body;

    let cart = await Cart.findOne({user:userId})

    if(!cart){
        cart = await Cart.create({
            user:userId,
            items:[{product:productId,quantity}]
        });
    }else{
        const existingitem = cart.items.find((items)=>
             items.product.toString()===productId
        )

        if(existingitem){
            existingitem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    }

    return res.status(200).json(new Apiresponse(200,cart,"Item added successfully"));
})

const deleteitem = asyncHandler(async(req,res)=>{
    const {productId} = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({user:userId});

    if(!cart){
        throw new Apierror(404,"Cart Not Founded");
    }
    const updatedcart = cart.items.filter((item)=>
        item.product.toString()!==productId
    )
    
    if(updatedcart.length===cart.length){
        const updatedcart = cart.items.filter((item)=>{
        item.product.toString()!==productId
    })
    }  

    cart.items= updatedcart;
    await cart.save()
    
    return res
    .status(200)
    .json(new Apiresponse(200, cart, "Product removed from cart"));

})

const updateQuantity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;
  const { quantity } = req.body; 

  if (!quantity || quantity < 1) {
    throw new Apierror(400, "Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Apierror(404, "Cart not found");

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) throw new Apierror(404, "Product not found in cart");

  item.quantity = quantity;

  await cart.save();

  return res
    .status(200)
    .json(new Apiresponse(200, cart, "Cart quantity updated successfully"));
});

const placeorder = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    const cart = await Cart.findOne({user:userId}).populate("items.product");

    if (!cart || cart.items.length === 0) {
    throw new Apierror(400, "Your cart is empty");
    }

    let amount = 0;
    for(const item of cart.items){
        amount += item.product.price * item.quantity;
    }

    const order = await Order.create({
        user:userId,
        items: cart.items.map((i)=>({
            product:i.product._id,
            quantity:i.quantity
        })),
        totalAmount:amount
    })

    for (const item of cart.items){
        const product = await Product.findById(item.product._id)
        if(product.stock<item.quantity){
            throw new Apierror(400, `Not enough stock for ${product.name}`);
        }
        product.stock -=item.quantity;
        await product.save();
    }

    cart.items=[];
    await cart.save();

    const user = await User.findById(userId)

    const useremail = user.email

    await sendmail({to:useremail,
        subject:"Order Confirmation",
        text: `Your order with ID ${order._id} has been placed successfully! Total: ₹${order.totalAmount}`, 
        html: `<h1>Order Confirmation</h1>
               <p>Your order with ID <b>${order._id}</b> has been placed successfully!</p>
               <p>Total: <b>₹${order.totalAmount}</b></p>`})

    return res
    .status(200)
    .json(new Apiresponse(200, order, "Order placed successfully"));

})

const getcart = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    const cart = await Cart.findOne({user:userId}).populate("items.product");

    if(!cart){
        return res.status(200).json(new Apiresponse(200,{items:[]},"Cart is empty"));
    }

    return res.status(200).json(new Apiresponse(200,cart,"Cart retrieved successfully"));
})

export {deleteitem,addtocart,updateQuantity,placeorder,getcart}