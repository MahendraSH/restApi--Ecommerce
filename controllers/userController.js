
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModels");

const ErrorHandler = require("../utils/errorHandler");
const sendjwtTokenSendCooki = require("../utils/jwtandcooki");
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// registor a user

const regestorUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;


    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "sample_id",
            url: "sample-url",
        },

    })
    const loginToken = await user.generateWebToken();
    sendjwtTokenSendCooki(user, 201, res);

})


//login user

const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("please enter email and password ", 400));

    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Ivaild email or password"), 401);
    }



    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Ivaild email or password"), 401);
    }
    sendjwtTokenSendCooki(user, 200, res);
})

const logutUser = catchAsyncErrors(async (req, res, next) => {

    res.cookie("loginToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "logged out "
    })
})

//  forgotPassword

const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const email = req.body.email
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("user does not exits , Invalid email ", 404));
    }

    //  get reset password token 
    const restToken = user.generateResetToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${restToken}`
    console.log("resetPasswordUrl : " + resetPasswordUrl);


    const mailMessage = `your passowrd reset url is \n \n :- \t ${resetPasswordUrl} \t \n \n If you have not requested ti please ignore it \n`
    try {

        await sendEmail({
            email: user.email,
            subject: " Ecomerce password recovery",
            mailMessage,
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${email} succesfully `,
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.restPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));

    }

})


//  resetPassword
const resetPassword = catchAsyncErrors(async (req, res, next) => {

    // restPasswordExpire
    // resetPasswordToken
    const resetPasswordToken = crypto
        .createHash(process.env.crypto_algo)
        .update(req.params.link)
        .digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        restPasswordExpire: { $gt: Date.now() },
    },)
    if (!user) {
        return next(new ErrorHandler("The reset password  link is invalid or expired ", 400))
    }


    const password = req.body.password;
    const conformPassword = req.body.conformPassword;
    if (!password || !conformPassword) {
        return next(new ErrorHandler(" The password : is required please enter it , The conformPassword : is required please enter it and both must be same", 400));
    }
    if (password !== conformPassword) {

        return next(new ErrorHandler("please enter the same passwords ", 400));

    }
    user.resetPasswordToken = undefined;
    user.password = password;
    user.restPasswordExpire = undefined;
    await user.save();
    sendjwtTokenSendCooki(user, 200, res);

})

// get user details  --login

const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    })
})

// update user password  --login

const updateUserPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    // to check weather old password is equal to user rpasswrod

    if (!req.body.oldPassword) {
        return next(new ErrorHandler("required oldPassword : please enter the old password", 400));
    }

    const oldPassword = req.body.oldPassword;


    const isPasswordMatch = await user.matchPassword(oldPassword);
    if (!isPasswordMatch) {
        return next(new ErrorHandler(" old   password  is incorrect ", 401));
    }

    const newPassword = req.body.newPassword;
    const conformPassword = req.body.conformPassword;
    if (!newPassword || !conformPassword) {
        return next(new ErrorHandler(" The newassword : is required please enter it , The conformPassword : is required please enter it and both must be same", 400));
    }
    if (newPassword !== conformPassword) {

        return next(new ErrorHandler("please enter the same passwords the new password  and conform  pasword must be same ", 400));

    }
    user.password = newPassword;
    await user.save();


    sendjwtTokenSendCooki(user, 200, res);
})

// update user details  --login

const updateUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    user.name = req.body.name;
    user.email = req.body.email;
    await user.save();


    sendjwtTokenSendCooki(user, 200, res);
})

//  getAllUsers (admin)
const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    })

})
//  getUser by id (admin)
const getUsersById = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(` user does not exit with this id : ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        user,
    })

})

// updateUserRole

const updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    user.name = req.body.name;
    user.email = req.body.email;
    user.role = "admin";
    await user.save();


    sendjwtTokenSendCooki(user, 200, res); //if we generate token then it use not use full  checkit on 
    //  a realTime server 
})

//  delte user by id 
const deleteUserById = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`user does not exits with id ${req.body.id}`, 404));
    }

    console.log(user)
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "user deleted succesfully",
    })
})



module.exports = {
    regestorUser,
    loginUser,
    logutUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updateUserPassword,
    updateUserDetails,
    getAllUsers,
    getUsersById,
    updateUserRole,
    deleteUserById,
};