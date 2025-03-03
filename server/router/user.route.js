const { Router } = require("express");
const { registerUserController, loginController, logoutController, uploadAvatar, updateUserDetails, forgotPasswordController, verifyForgotPasswordOtp, resetpassword, refreshToken, userDetails } = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const verifyEmailController = require("../utils/verifyEmailTemplate");


const userRouter  = Router()

userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetails)




module.exports = userRouter