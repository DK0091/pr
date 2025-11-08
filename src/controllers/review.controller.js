import { Product } from "../models/Product.model.js";
import Apiresponse from "../utils/apiresponse.js";
import asyncHandler from "../utils/asynchandler.js";
import Apierror from "../utils/apierror.js";


const addReview = asyncHandler(async(req,res)=>{
    const {productId} = req.params;
    const userId = req.user._id;
    const {comment , rating} = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new Apierror(404, "Product not found");

    const existingReview = product.reviews.find((rev)=>
        rev.user.toString() === userId.toString()
    )
    
    if(existingReview) {
        throw new Apierror(400, "You already reviewed this product");
    }

    product.reviews.push({ user: userId, rating:rating, comment:comment });

    product.rating = product.reviews.length > 0 ? product.reviews.reduce((acc,r)=>
        acc + r.rating , 0 ) / product.reviews.length : 0

    await product.save();

    return res.status(200).json(new Apiresponse(200,product.reviews,"Review Added"))
    
})

const updatereview = asyncHandler(async(req,res)=>{
    const {productId} = req.params;
    const userId = req.user._id;
    const {comment , rating} = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new Apierror(404, "Product not found");

    const existingReview = product.reviews.find((rev)=>
        rev.user.toString() === userId.toString()
    )
    
    if(existingReview) {
        if(comment) existingReview.comment = comment;
        if(rating)  existingReview.rating = rating
    }

    product.rating = product.reviews.reduce((acc,r)=>acc+r.rating,0)/product.reviews.length

    await product.save();

    return res
    .status(200)
    .json({ success: true, product, message: "Review updated successfully" });
})

const deletereview = asyncHandler(async(req,res)=>{
    const {productId} = req.params
    const userId = req.user._id

      const product = await Product.findById(productId);
    if (!product) throw new Apierror(404, "Product not found");

    const existingReview = product.reviews.find((rev)=>
        rev.user.toString() === userId.toString()
    )

    existingReview.remove();

    product.rating = product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length : 0;

    await product.save();

     return res
    .status(200)
    .json({ success: true, product, message: "Review deleted successfully" });
})

const getallreviews = asyncHandler(async(req,res)=>{
    const {productId} = req.params
    
    const product = await Product.findById(productId).populate("reviews.user ","name")

    if (!product) {
        throw new Apierror(404, "Product not found");
    }

    return res
    .status(200)
    .json(new Apiresponse(200, product.reviews, "Reviews fetched successfully"));
})

export {getallreviews,deletereview,addReview,updatereview}