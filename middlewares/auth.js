const userModule = require("../models/userModels");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")

const autherziedUser = catchAsyncErrors(async (req, res, next) => {

    const { loginToken } = req.cookies;
    if (!loginToken) {
        return next(new ErrorHandler("please login  to acccess this resource ", 401));
    }
    const decodeData = jwt.verify(loginToken, process.env.jwt_secrect);

    req.user = await userModule.findById(decodeData.id);
    // console.log(req.user);
    next();
})

const autherziedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role : ${req.user.role}  can not access this resouce `, 403));
        }
        next();
    }
}

module.exports = { autherziedUser, autherziedRoles };