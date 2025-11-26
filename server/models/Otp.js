import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import {mailSender} from '../services/mailSender';



const optSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,

    },
    otp:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:'60*5s',
    },
    opt_type:{
        type:String,
        enum:['phone','email','reset_pin','password_reset'],
        required:true
    }
});


optSchema.pre('save',async function(next){
    if(!this.isNew){
       const salt = await bcrypt.genSalt(10);
       await sendVerificationMail(this.email,this.otp,this.opt_type);
       this.opt =await bcrypt.hash(this.otp,salt); 

    }
    next();
   
});

otpSchema.methods.compareOtp= async function(enteredOtp){
   return  await bcrypt.compare(enteredOtp,this.otp)
}

async function sendVerificationMail(email,otp,otp_type) {
    try{
        const mailResponse = await mailSender(email,otp,otp_type);

    }catch(error){
        console.log(error);
    }
}