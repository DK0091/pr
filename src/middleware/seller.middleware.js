import { User } from "../models/user.model.js";
import Apierror from "../utils/apierror.js";
import asyncHandler from "../utils/asynchandler.js";

const isseller = asyncHandler(async(req,res,next)=>{
    
    if(req.user.role !== "seller"){
        throw new Apierror(400,"Only seller")
    }

    next();
})

export default isseller;