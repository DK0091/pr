import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","seller","admin"],
        default: "user"
    },
    refreshtoken:{
        type:String
    },
    avatar:{
        type:String,
        required:true
    },
    addresses:[
        {
            label: String, 
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
            phone: String
        }
    ],
    watchlist:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Product"
        }
    ],
    notifications:[
        {
            message:String,
            read:
            {
                type:Boolean,
                default:false
            },
            createdAt:{
                type: Date, default: Date.now
            }
        }
    ],
    resettoken:{
        type:String,
        default :" "
    },
    resetexpiry :{
        type: Date
    },
    enable2FA:{
        type:Boolean,
        default:false
    },
    secret:{
        type:String,
        default: null 
    },
    tempsecret:{
        type:String,
        default: null 
    }
},
{timestamps:true})

UserSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
     this.password = await bcrypt.hash(this.password,10)
     next();
})

UserSchema.methods.isPasswordCorrect = async function(enteredpass){
    return await bcrypt.compare(enteredpass,this.password)
}

UserSchema.methods.generateaccesstoken = async function(){
    return jwt.sign({
        id:this.id,
        username:this.username,
        email:this.email,
        role:this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY

    })
}

UserSchema.methods.generaterefreshtoken = async function(){
    return jwt.sign({
        id:this.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User",UserSchema)