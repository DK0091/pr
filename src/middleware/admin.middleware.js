import { User } from "../models/user.model.js";
import Apierror from "../utils/apierror.js";
import asyncHandler from "../utils/asynchandler.js";


 export const adminonly = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new Apierror(404,"Admin not found ")
    }
    if(user.role!=="admin"){
        throw new Apierror(403,"Admin only")
    }
    next();
})
