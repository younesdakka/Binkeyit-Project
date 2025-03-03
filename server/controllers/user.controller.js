const sendEmail = require("../config/sendEmail");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const verifyEmailTemplate = require("../utils/verifyEmailTemplate");
const generatedAccessToken = require("../utils/generatedAccessToken");
const genertedRefreshToken = require("../utils/generatedRefreshToken");
const  uploadImageClodinary = require("../utils/uploadImageClodinary");
const generatedOtp = require("../utils/generatedOtp");
const forgotPasswordTemplate = require("../utils/forgotPasswordTemplate");
const jwt = require("jsonwebtoken");

const checkUser = async (email) => {
  const user = await UserModel.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  }
};

const hashPassword = async ({ password, name, email }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return { name, email, password: hashedPassword };
};

const validateData = ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("Invalid data: Name, Email, and Password are required");
  }
};

const successResponse = (user) => {
  const userData = { ...user._doc };
  delete userData.password;
  return {
    success: true,
    status: 201,
    message: "User created successfully",
    data: userData,
  };
};

const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    validateData(req.body);
    
    await checkUser(email);
    
    const payload = await hashPassword(req.body);
    
    const newUser = new UserModel(payload);
    const savedUser = await newUser.save();
    console.log("User saved:", savedUser);
    
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;
    
    await sendEmail({
      sendTo: email,
      subject: "Verify your email - Binkeyit",
      html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
    });
    
    res.status(201).json(successResponse(savedUser));
  } catch (error) {
    console.error("Registration Error:", error);
    next(error);
  }
};




///////////////////////////////////////////////////////////////
const loginController = async (req, res) => {
try {
    const {email,password} =req.body
    if(!email || !password){
        return res.status(400).json({
            message : "provide email, password",
            error : true,
            success : false
        })
    }
    const user = await UserModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:'user not register',
            error:true,
            success:false
        })
    }
    if(user.status !== 'Active'){
        return res.status(400).json({
            message:'Account inactive. Please contact admin.',
            error:true,
            success:false
        })
    }

    const checkPassword = await bcrypt.compare(password,user.password)
    if(!checkPassword){
        return res.status(400).json({
            message : 'Invalid password',
            error:true,
            success:false
        })
    }
    const accesstoken = await generatedAccessToken(user._id)
    const refreshToken = await genertedRefreshToken(user._id)
    const cookieOption = {
        httpOnly:true,
        secure:true,
        sameSite:'None'
    }
    res.cookie('accessToken',accesstoken,cookieOption)
    res.cookie('refreshToken',refreshToken,cookieOption)
    return res.json({
        message : 'login successfly',
        error:false,
        success:true,
        data:{accesstoken,refreshToken}
    })
} catch (error) {
    console.log("Login error", error);
    
    res.status(500).json({
        message:error.message || "Internal server error",
        error:true,
        success:false
    })
}
}
///////////////////////////////////////////////////////
const logoutController = async (req,res)=>{
    try {
        const userid = req.userId 

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.clearCookie("accessToken",cookiesOption)
        res.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return res.json({
            message : "Logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

const uploadAvatar= async (req,res)=>{
    try {
        const userId = req.userId 
        const image = req.file  

        const upload = await uploadImageClodinary(image)
        
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })

        return res.json({
            message : "upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//////////////////////////////////////////////////////////////////
const updateUserDetails = async (req,res)=>{
    try {
        const userId = req.userId 
        const { name, email, mobile, password } = req.body 

        let hashPassword = ""

        if(password){
            const salt = await bcrypt.genSalt(10)
            hashPassword = await bcrypt.hash(password,salt)
        }

        const updateUser = await UserModel.updateOne({ _id : userId},{
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password : hashPassword })
        })

        return res.json({
            message : "Updated successfully",
            error : false,
            success : true,
            data : updateUser
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

const forgotPasswordController = async (req,res) => {
    try {
        const { email } = req.body 

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000 // 1hr

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "Forgot password from Binkeyit",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return res.json({
            message : "check your email",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

////////////////////////////////////////////////////////////////////////////
const verifyForgotPasswordOtp= async (req,res)=>{
    try {
        const { email , otp }  = req.body

        if(!email || !otp){
            return res.status(400).json({
                message : "Provide required field email, otp.",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime  ){
            return res.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return res.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }   

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return res.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

///////////////////////////////////////////////////////
const resetpassword =async(req,res)=> {
    try {
        const { email , newPassword, confirmPassword } = req.body 

        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message : "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message : "newPassword and confirmPassword must be same.",
                error : true,
                success : false,
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return res.json({
            message : "Password updated successfully.",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

////////////////////////////////////////////////////////////////////
const refreshToken= async (req,res)=>{
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1] 

        if(!refreshToken){
            return res.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return res.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.cookie('accessToken',newAccessToken,cookiesOption)

        return res.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

////////////////////////////////////////////////////////////////////////
const userDetails= async(req,res)=>{
    try {
        const userId  = req.userId

        console.log(userId)

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return res.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}


module.exports = { registerUserController,loginController ,logoutController,uploadAvatar,
    updateUserDetails,forgotPasswordController,verifyForgotPasswordOtp,resetpassword,
    refreshToken,userDetails };

