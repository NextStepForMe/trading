import User from '../models/user';
import OTP from '../models/otp';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';    
import { badRequestError } from '../../errors';
import {generateOtp} from '../../services/mailSender';
// import {sendMail} from '../utils/sendEmai';




const verifyOtp = async(req,res)=>{
    const {email, otp , otp_type , data }=req.body;

    if (!email || !otp || !otp_type  ) {
        throw new badRequestError('Please provide all values');
      }else if (otp_type!=="email" && !data){
        throw new badRequestError("please provide all values");

      }

      const otpRecord = await OTP.findOne({ email , otp_type }).sort({createAt : -1});

      if (!otpRecord) {
        throw new badRequestError(`otp expired `);
      }

      const isVerified = await otpRecord.compareOtp(otp);

      if(!isVerified){
          throw new badRequestError(`invalid otp`);
      }

      await OTP.findOneAndDelete({ otpRecord.id });


      switch(otp_type){
        case "phone":
            await User.findByIdAndUpdate({email},{phone_number:data});
            break;
        
        case "email":
                
                break;
        

        case "rest_pin":
            if(data.length!==4){
              throw new badRequestError("pin length must be equal to four");
            }
            await User.updatePIN(email,data);
            break;
        
        case "reset_password":
            await User.updatePassword(email,data);
            break;

        default:
            throw new badRequestError(`invalid otp type`);
      }
   
 }


const user = await User.findOne({email});
if(otp_type==="email" && !user ){
  const register_token = jwt.sign(
    {email},
    process.env.REGISTER_SECRET,
    {expiresIn: process.env.REGISTER_SECRET_expiry}
  );

  return res.status(StatusCodes.OK).json({
    msg:`${register_token}`,
  });


  res.status(StatusCodes.OK).json({msg:"success veryfied otp"});
}






const sendOTP = async(req,res)=>{
    const {email , otp_type}= req.body;
    if(!email || !otp_type){
        throw new badRequestError("provide all values")
    }


    const user = await User.findOne({email});
    if(!user && otp_type == 'phone'){
        throw new badRequestError("no user found");
    }
    if(otp_type)
}