import User from '../../models/User';
import { StatusCodes } from 'http-status-codes';
import { badRequestError,unauthorizedError } from '../../errors/index';




const register = async(req,res)=>{
    const {name,email,register_token} = req.body;

    if(!email || !password,register_token){
        throw new badRequestError('Please provide email and password');
    }

    const user = await User.findOne({email});
    if(user){
        throw new badRequestError(`Email ${user.email} already exists`);
    }

    try{
        const payload = jwt.verify(register_token,process.env.REGISTER_SECRET);
        if(payload.email !== email){
            throw new UnauthorizedError('Invalid token');
        }

        const newUser = await User.create({email,password});
        const access_token = newUser.createAccessToken();
        const refresh_token = newUser.createRefreshToken();
        res.status(StatusCodes.CREATED).json({
           user:{
               userID:newUser.id,
               email:newUser.email,
               tokens:{
                   accessToken:access_token,
                   refreshToken:refresh_token   

               
           }}
        })
    }catch(error){
        console.log(error);
        throw new badRequestError('Invalid token');
    }

    
}


const login = async(req,res)=>{
    const {email,password} = req.body;
    if (!email || !password){
        throw new badRequestError('Please provide email and password')
        }

    const user = await User.findOne({email});
    if(!user){
        throw new UnauthorizedError('Invalid credentials');
    }   
    
    const isPasswordCorrect = await user.comparePasswords(password);
    if(!isPasswordCorrect){
        let message;

        if(user.blocked_until_password && user.blocked_until_password > Date.now()){
           const remainingTime = Math.ceil(
               (user.blocked_until_password - Date.now()) / (1000 * 60)

           );
           message = `Incorrect password. You will be blocked for ${remainingTime} minutes.`;

        }
        
        else {
           const attmeptsRemaining =3- user.wrong_password_attempts;
           message = attmeptsRemaining>0 ?
           `Incorrect password. ${attmeptsRemaining} attempts remaining.`:
           'Too many wrong passwords. Please wait 1 hour.';
        }

        throw new UnauthorizedError(message); 
        
    }


    const access_token = user.createAccessToken();
    const refresh_token = user.createRefreshToken();

    let phone_exist = false;
    let login_pin_exist = false;


    if(user.phone_number){
        phone_exist=true;
    }
    if(user.login_pin){
        login_pin_exist=true;
    }
    res.status(StatusCodes.OK).json({
        user:{
           
            email:user.email,
            userId:user._id,
            phone_exist:phone_exist,
            login_pin_exist:login_pin_exist,
        },
        tokens:{
            access_token,
           refresh_token,
        }
    }
    )




}






const refreshToken = async(req,res)=>{
    const {type , refresh_token}=req.body;
    if(!type || !["socket","app"].includes(type)|| !refresh_token){
        throw new badRequestError("invalid body");
    }
    try{
        let accessToken,newRefreshToken;

        if(type="app"){
            ({access_token:accessToken , newRefreshToken}=await generateRefreshToken(
                refresh_token,
                process.env.REFRESH_SECRET,
                process.env.REFRESH_EXPIRY,
                process.env.ACCESS_SECRET,
                process.env.ACCESS_EXPIRY));
        }

        else if (type==="socket"){
            ({access_token:accessToken , newRefreshToken}=await generateRefreshToken(
                refresh_token,
                process.env.SOCKET_REFRESH_SECRET,
                process.env.SOCKET_REFRESH_EXPIRY,
                process.env.SOCKET_ACCESS_SECRET,
                process.env.SOCKET_ACCESS_EXPIRY));
        }


        res.status(StatusCodes.OK).json({access_token,newRefreshToken});
        
    }catch(err){
        console.error(err);
        throw new UnauthorizedError(' Invalid Token');
    }
    }





const logout = async(req,res)=>{
    const accessToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(accessToken,process.env.JWT_SECRET);
    const user = decoded.userId;
    await User.updateOne({_id:user},{$unset:{biometricKey:1}});
    res.status(StatusCodes.OK).json({message:'Logged out  successfully'});
}
;







async function generateRefreshToken(
    token,
    refresh_secret,
    refresh_expiry,
    access_secret,
    access_expiry
){
   
    try{
        const payload = jwt.verify(token,refresh_secret);
        const user = await User.findById(payload.userId);
        if(!user){
            throw new UnauthorizedError('Authentication Invalid');
        }
        const access_token = user.sign(
            {userId:payload.userId},
            access_secret,
            {expiresIn:access_expiry}

        );

        const newRefreshToken = user.sign(
            {userId:payload.userId},
            refresh_secret,
            {expiresIn:refresh_expiry}
        );
        return{access_token,newRefreshToken};

        
    } catch(err){
        console.error(err);
        throw new UnauthorizedError('Authentication Invalid');

    }
}

export default{
    register,
    login,
    logout,
    refreshToken,
}