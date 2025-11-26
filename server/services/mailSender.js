import otpGenerator from 'otp-generator';
import nodeMailer from 'nodemailer';
import fs from 'fs';
import inlinecss from 'inline-css';


export const mailSender = async (email, otp, otp_type) => {

    let htmlContent = fs.readFileSync('otp_template.html', { encoding: "utf-8" });
    htmlContent = htmlContent.replace("TrandingApp_otp", otp);
    htmlContent = htmlContent.replace("TrandingApp_otp2", otp_type);

    const options = {
        url:''
      };
    
    htmlContent = await inlinecss(htmlContent,options);

    try{
        var transporter = nodeMailer.createTransport({
            host:process.env.MAIL_HOST,
            port:process.env.MAIL_PORT,
            secure:false,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            
        }); 

       var result = await transporter.sendMail({
           from:process.env.MAIL_FROM,
           to: email,
           subject:"OTP Verification",
           html:htmlContent
        });

        return result;


}catch(err){
    console.log(err);
}   
};




export const generateOtp = () => {
    const opt = optGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    });
    return opt;
};







