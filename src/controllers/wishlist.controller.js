import { Wishlist } from "../models/wishlist.model";
import Apierror from "../utils/apierror";
import Apiresponse from "../utils/apiresponse";
import asyncHandler from "../utils/asynchandler";


const addTowishlist = asyncHandler(async(req,res)=>{
    const {productId} = req.params;
    const userId = req.user._id

    let wishlist = await Wishlist.findOne({user:userId})

    if(!wishlist){
        wishlist = await Wishlist.create({
            user:userId,
            items:[{product:productId}]
        })
    }
    else{
        const finding = wishlist.items.find((item)=>
            item.product.toString()===productId
        )

        if(finding){
            throw new Apierror(400,"Item Already Added")
        }
        else{
            wishlist.items.push({product:productId})
        }
        await wishlist.save();
    }
    return res.status(200).json(new Apiresponse(200,{wishlist},"Item Added To Wishlist"))
})

const removeFromwishlist = asyncHandler(async(req,res)=>{
    const {productId} = req.params
    const userId = req.user._id

    const wishlist = await Wishlist.findOne({user:userId})

     if (!wishlist) {
        throw new Apierror(404, "Wishlist not found");
  }

    const updatedWishlist = wishlist.items.filter((item)=>
        item.product.toString()!==productId
    )

    wishlist.items = updatedWishlist;
    await wishlist.save();


    return res.status(200).json(new Apiresponse(200,{wishlist},"Item Deleted from Wishlist"))

})

const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    "items.product"
  );

  if (!wishlist || wishlist.items.length === 0) {
    return res
      .status(200)
      .json(new Apiresponse(200, [], "Your wishlist is empty"));
  }

  return res
    .status(200)
    .json(new Apiresponse(200, wishlist, "Wishlist fetched successfully"));
});

export {addTowishlist,getWishlist,removeFromwishlist}