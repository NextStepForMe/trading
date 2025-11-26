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
      
   
 }


