import { Product } from "../models/Product.model.js";
import Apierror from "../utils/apierror.js";
import Apiresponse from "../utils/apiresponse.js";
import asyncHandler from "../utils/asynchandler.js";

const getallproducts = asyncHandler(async(req,res)=>{
    const products = await Product.find().populate(" seller ","name email");
    res.status(200)
    .json(new Apiresponse(200,products,"Products fetched"))
})

const addproduct = asyncHandler(async(req,res)=>{
    const {price , stock , description , name , category , image} =  req.body;

    if(!name || !description || !price || !category){
        return res.status(400).json({ message: "All required fields must be provided" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      seller:req.user._id
    })

    return res.json(new Apiresponse(200,product, "Product added successfully"))
})

const getproductbyId = asyncHandler(async(req,res)=>{

        const { id } = req.params;

        const product = await Product.findById(id)

        if(!product){
            throw new Apierror(400,"Invalid Id")
        }

        return res.status(200).json(new Apiresponse(200,product,"Product Fetched"))
})

const updateproduct = asyncHandler(async(req,res)=>{

    const {id} = req.params;
    const updates = req.body;

    if(!updates){
        throw new Apierror(400,"Updates not given")
    }

    const product = await Product.findById(id);

    if (!product) throw new Apierror(404, "Product not found");

    if(req.user.role!=="admin" && req.user._id.toString() !== product.seller._id.toString()){
        throw new  Apierror(403, "You can only update your own products")
    }

    const updatedProduct = await Product.findByIdAndUpdate(id,updates,{
        new:true
        })


     return res.status(200).json(new Apiresponse(200,updatedProduct,"Product Updated"))
})

const deleteProduct = asyncHandler(async(req,res)=>{

    const {id} = req.params;


    const product = await Product.findById(id)

    if(!product){
        throw new Apierror(400,"Product Not found")
    }

    if(req.user.role!=="admin" && req.user._id.toString()!==product.seller._id.toString()){

        throw new  Apierror(403, "You can only delete your own products")
    }

    product.deleteOne();

    return res.status(200).json(new Apiresponse(200,{},"Product deleted successfully"))
})

export {deleteProduct,getallproducts,getproductbyId,addproduct,updateproduct}