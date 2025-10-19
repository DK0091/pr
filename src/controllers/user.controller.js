import asyncHandler from "../utils/asynchandler.js";
import {User} from "../models/user.model.js"
import Apierror from "../utils/apierror.js";
import Apiresponse from "../utils/apiresponse.js"
import jwt from "jsonwebtoken"                          
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { sendmail } from "../utils/mailer.js";
import speakeasy from "speakeasy"
import qrcode from "qrcode"

const registeruser = asyncHandler(async(req , res)=>{
    const {username , email ,password,role} = req.body;
     if(!(username&&email&&password&&role)){
        throw new Apierror(400,"ALL Fields are mandatory")
    }

    const userexisted = await User.findOne({
        $or:[{username},{email}]
    })

    if(userexisted){
       throw new Apierror(400,"User exists")
    }

       if(!req.file){
        throw new Apierror(401,"File not uploaded")
    }

    if(!req.file.path){
        throw new Apierror(401,"url not found")
    }

    const createuser = await User.create({
        username,
        email,
        password,
        role,
        avatar : req.file.path
    })


     if(!createuser){
        throw new Apierror(500,"there is an error on server side")
     }
     return res.status(200).json(new Apiresponse(200,createuser,"USer created"))
})

const login = asyncHandler(async(req,res)=>{
    const {username , email, password } = req.body
    if(!(username || email)){
        throw new Apierror(400,"Username or email is required")
    }
    const user = await User.findOne({
        $or:[{email},{username}]
    })
     if(!user){
       throw new  Apierror(404,"user not found")
    }

    const checkpass = await user.isPasswordCorrect(password)
    if(!checkpass){
        throw new Apierror(400,"Password is incorrect")
    }

    const refreshtoken = await user.generaterefreshtoken()

    const accesstoken = await user.generateaccesstoken()

    user.refreshtoken=refreshtoken;

    await user.save({validateBeforeSave:false});

    const loggedin = await User.findOne({email}).select("-password -refreshtoken")

    const options ={
        httpOnly:true,
        secure:true
    }

    if(!user.enable2FA){
        return res.status(200)
        .cookie("refreshtoken",refreshtoken,options)
        .cookie("accesstoken",accesstoken,options)
        .json(new Apiresponse(200,{loggedin,accesstoken},"user logged in"))
    }

    return res.status(200).json(new Apiresponse(200,{userId: user._id },"2FA required"))
})

const checktoken = asyncHandler(async(req,res)=>{
    const incomingrefreshtoken = req.cookies.refreshtoken

    if(!incomingrefreshtoken){
        throw new Apierror(400,"Unathorized request")
    }
    const decodedinfo = jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedinfo?.id)

    if(!user){
        throw new Apierror(401,"invalid refresh token")
    }

    if(user.refreshtoken!==incomingrefreshtoken){
        throw new Apierror(401,"refresh token is expired")
    }
    
    const acccesstoken = await user.generateaccesstoken();

    const refreshtoken = await user.generaterefreshtoken();

     user.refreshtoken = refreshtoken;
     await user.save({ validateBeforeSave: false });

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accesstoken",acccesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(new Apiresponse(200,{acccesstoken,refreshtoken},"Token refrshed successfully"))

})

const currentuser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id).select("-password -refreshtoken")
    return res.status(200)
    .json(new Apiresponse(200,user,"CurrentUser"))
})

const updatepassword = asyncHandler(async(req,res)=>{
    const {newpassword,oldpassword} = req.body

    const user = await User.findById(req.user?._id)

    if(!user){
        throw new Apierror(401,"Unathorized request")
    }

    const check = await user.isPasswordCorrect(oldpassword)

    if(!check){
        throw new Apierror(400,"Invalid password")
    }

    user.password=newpassword;

    await user.save({validateBeforeSave:false})

    return res.status(200).
    json(new Apiresponse(200,{},"Password changed succesfully"))
})

const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(401).json({ statusCode: 401, message: "Unauthorized request" });

  user.refreshtoken = "";
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("refreshtoken", options)
    .clearCookie("accesstoken", options)
    .json({ statusCode: 200, data: {}, message: "User logged out" });
});

const updatedetails = asyncHandler(async (req, res) => {
    const { username, email, role } = req.body;

    if (!(username || email || role)) {
        throw new Apierror(400, "At least one field is required");
    }

    const user = await User.findById(req.user?._id).select("-password -refreshtoken");

    if (!user) {
        throw new Apierror(404, "User not found");
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new Apiresponse(200, user, "User details updated successfully"));
});

const uploadavatar = asyncHandler(async(req,res)=>{
    if(!req.file){
        throw new Apierror(401,"File not uploaded")
    }

    if(!req.file.path){
        throw new Apierror(401,"url not found")
    }

    const user = await User.findById(req.user?._id)

    user.avatar = req.file.path;

    return res.status(200)
    .json(new Apiresponse(200,user,"avatar uploaded succesfully"))


})

const deleteaccount = asyncHandler(async(req,res)=>{
    const user = await User.findByIdAndDelete(req.user?._id)

    if(!user){
        throw new Apierror(400,"User not found")
    }
    return res.status(200).json(new Apiresponse(200,{},"User deleted Successfully"))
})

const updaterole = asyncHandler(async(req,res)=>{
    const {newrole} = req.body

    if(!newrole){
        throw new Apierror(403,"No role mentioned to update")
    }

    const user = await User.findById(req.params.id)

    if(!user){
        throw new Apierror(404,"User Not Found")
    }

    const allowedRoles = ["buyer", "seller", "admin"];
    if(!allowedRoles.includes(newrole)) {
        throw new Apierror(400, "Invalid role");
    }

    user.role = newrole

    await user.save({validateBeforeSave:false})

    return res.status(200).json(new Apiresponse(200,user,"Role Updated"))

})

const getnotifications = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new Apierror(404,"User not found")
    }

    const notification =  user.notifications

    return res.status(200).json(new Apiresponse(200,notification,"Notification fetched"))
})

const notificationread = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id)

     if(!user){
        throw new Apierror(404,"User not found")
    }

    const notification = user.notifications.id(req.params.id)

    if(!notification){
        throw new Apierror(404,"notification not found")
    }

    notification.read=true;

    await user.save();

    return res.status(200).json(new Apiresponse(200,notification,"Notification marked as read"))
})

const deletenotification = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id)

      if(!user){
        throw new Apierror(404,"User not found")
    }

    user.notifications= user.notifications.filter((notify)=>
        notify._id.toString() !== req.params.id
    )

    await user.save();

    return res.status(200).json(new Apiresponse(200, {}, "Notification deleted"));
})

const forgotpassword = asyncHandler(async(req,res)=>{
    const {email} = req.body

    const user = await User.findOne({email})

    if(!user){
        throw new Apierror(400,"user not found")
    }

    const token = crypto.randomBytes(32).toString("hex");

    const hashedtoken = await bcrypt.hash(token,10)

    user.resettoken = hashedtoken;
    user.resetexpiry = Date.now() + 15 * 60 * 1000 ;
    await user.save()

    const resetUrl = `http://localhost:5173/reset-password/${user._id}/${token}`
    
    await sendmail({to:email,subject:"Password Reset Request",text:resetUrl})

    return res.status(200).json(new Apiresponse(200,{},"Password reset email sent"))
})

const resetpassword = asyncHandler(async(req,res)=>{
    console.log("Received URL Parameters:", req.params.userid);
    const {userid,token} = req.params
    const {password} = req.body
    
    const user = await User.findById(userid)

    if(!user){
        throw new Error("User not found");
    }  
    
    if (!user.resetexpiry || user.resetexpiry < Date.now()) {
        throw new Apierror(400, "Token expired");
    }

    const isvalid = await bcrypt.compare(token,user.resettoken)

    if(!isvalid){
        throw new Apierror(400,"Invalid or expired token")
    }

    const hashedpass = await bcrypt.hash(password,10)

    user.password=hashedpass;
    user.resettoken=null;
    user.resetexpiry=null;
    await user.save();
    return res.status(200).json(new Apiresponse(200,{},"Password Reset successfully"))
})

const enable2F = asyncHandler(async(req,res)=>{

    if (!req.user?._id) throw new Apierror(401, "Unauthorized");

    const user = await User.findById(req.user?._id);

    const secret = speakeasy.generateSecret({
        name:` MY APP ${user.email}`,
        length:20
    })

    user.tempsecret = secret.base32;
    await user.save()

    const geneateqr = await qrcode.toDataURL(secret.otpauth_url)

    return res.status(200).json(new Apiresponse(200,{geneateqr,secret:secret.base32},"Scan this QR code with Google Authenticator"));
})

const verify2FA = asyncHandler(async(req,res)=>{
    const {userId,token} = req.body

    if(!token){
        throw new Apierror(400,"OTP required")
    }

    const user = await User.findById(userId);

    if(!user) throw new Apierror(400, "User not found");

    if(!(user.tempsecret||user.secret)){
        throw new Apierror(400, "2FA not enabled");
    }

    const secrettoverify = user.secret || user.tempsecret;

    const verified = speakeasy.totp.verify({
        secret:secrettoverify,
        encoding:"base32",
        token
    })

    if(!verified){
        throw new Apierror(400,"Wrong OTP")
    }

    user.secret = secrettoverify;
    user.enable2FA=true;
    user.tempsecret=undefined;
   

    const refreshtoken = await user.generaterefreshtoken();
    const accesstoken = await user.generateaccesstoken();

    user.refreshtoken= refreshtoken;
    await user.save({validateBeforeSave:false});

    const loggedin = await User.findById(userId).select("-password -refreshtoken")

    const options ={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
        .cookie("refreshtoken",refreshtoken,options)
        .cookie("accesstoken",accesstoken,options)
        .json(new Apiresponse(200,{loggedin,accesstoken},"user logged in"))

})

export {registeruser,login,checktoken,currentuser,updatepassword,logout,updatedetails,uploadavatar
        ,updaterole,deleteaccount,notificationread,getnotifications,deletenotification,forgotpassword
        ,resetpassword,verify2FA,enable2F}