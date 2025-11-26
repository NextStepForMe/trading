import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { type } from 'os';
import { match } from 'assert';
import { timeStamp } from 'console';
import { badRequestError, notFoundError } from '../errors';
import BadRequest from '../errors/bad-requests';
import UnauthenticatedError from '../errors/unauthenticated';




const UserScehma = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        match :[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide a valid Email'],


    },
    password:{
        type:String,

    },
    name:{
        type:String,
        minlength:3,
         maxlength:50
    },

    login_pin:{
        type:String,
        minlength:4,
        maxlength:4
    },

    phone_number:{
        type:Number,
        match:[
            /^[0-9]+$/,"Phone number must be only digits"
        ],
        unique:true,
        sparse :true
    },
    date_of_birth:{
        type:Date,
    },
    biometricKey:{
        type:String,
    },
    gender:{
        type:String,
        enum:['male','female','other']
    },
    wrong_pin_attempts:{
        type:Number,
        default:0
    },
    blocked_until_pin:{
        type:Date,
        default:null
    },
    wrong_password_attempts:{
        type:Number,
        default:0
    },
    blocked_until_password:{
        type:Date,
        default:null
    },
    balance:{
        type:Number,
        default:50000.0,
    },

    
},{timestamp:true}


);

UserScehma.pre("save",async function(){
    if(this.isModified("password")){

    const salt=await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt)
    }
    
})

UserScehma.pre("save",async function(){
    if(this.isModified("login_pin")){
        const salt=await bcrypt.genSalt(10);
        this.login_pin= await bcrypt.hash(this.login_pin,salt);
        }
});


UserScehma.static.updatePIN = async function(email,newPin){
    try{
const user=await this.findOne({email});
if (!user){
    throw new notFoundError("user not found ");
}

    const isSamePIN = await bcrypt.compare(newPin,user.login_pin);
    if(isSamePIN){
        throw new badRequestError("New pin must be deferent ");

    }
    const salt = await bcrypt.genSalt(10);
    const hashedPIN = await bcrypt.hash(newPin,salt);

    await this.findOneAndUpdate({email},{login_pin:hashedPIN , wrong_pin_attempts:0 ,blocked_until_pin:null});
    return {success:true,message:"pin updated successfully" };



    }catch(err){
        throw err;
    }
}




UserScehma.static.updatePassword = async function(email,password){
    try{
const user=await this.findOne({email});
if (!user){
    throw new notFoundError("user not found ");
}
    const isSamePass = await bcrypt.compare(password,user.password); 
    if(isSamePass){
        throw new badRequestError("New Password must be deferent ");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password,salt);
    await this.findOneAndUpdate({email},{password:hashedPass,wrong_password_attempts:0,blocked_until_password:null});   
   return {success:true,message:"password updated successfully" };
}catch(err){
        throw err;
    }

    }



UserScehma.static.comparePassword = async function(candidatePassword){
    if(this.blocked_until_password && this.blocked_until_password > new Date()){
        throw new UnauthenticatedError("account is locked ivalid login");

    }
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    if(!isMatch){
        this.wrong_password_attempts++;
        if(this.wrong_password_attempts >= 3 ){
            this.blocked_until_password=new Date(Date.now()+10 * 60 * 1000);
            await this.save();
            throw new UnauthenticatedError("account is locked ivalid login");
        }else{
            this.wrong_password_attempts=0;
            this.blocked_until_password=null;
            await this.save();
        }
        return isMatch;
}}
    





UserScehma.methods.comparePIN = async function(candidatePIN){
    if(this.blocked_until_pin && this.blocked_until_pin > new Date()){
        throw new UnauthenticatedError("account is locked ivalid PIN");
        }
    
    const hashedPIN = this.login_pin;
    const isMatch = await bcrypt.compare(candidatePIN,hashedPIN);
    if(!isMatch){
        this.wrong_pin_attempts++;
        if(this.wrong_pin_attempts >= 3 ){
            this.blocked_until_pin=new Date(Date.now()+10 * 60 * 1000);
            await this.save();
            throw new UnauthenticatedError("account is locked ivalid PIN");
        }else{
            this.wrong_pin_attempts=0;
            this.blocked_until_pin=null;
        }
        return isMatch;

    }

}









UserScehma.methods.createAccessToken = function(){
    return jwt.sign(
        {
            userId:this._id,
            name:this.name,
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )
}









export default mongoose.model("User",UserScehma);