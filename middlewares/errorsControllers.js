const ErrorHandler = require("../utils/errorHandler");

const errorController=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.message=err.message||"internal server error ";


    // worng mongodb id  error cast error 
    if (err.name ==='CastError'){
        const message=`resource  not found  Invaid : ${err.path}` ;
        err=new ErrorHandler(message,400);
    }

    // JsonWebTokenError 
    if (err.name ==='JsonWebTokenError'){
        const message =`JsonWebToken is invalid , try again ` ;
        err=new ErrorHandler(message,400);
    }

    //  token exprire error 
    if (err.name ==="TokenExpiredErro"){

        const message = `JsonWebToken is expired , try again `;
        err = new ErrorHandler(message, 400);
    }

    // duplicate email error 

    if(err.code == 11000){

        const message = ` Duplicate  ${Object.keys(err.keyValue)}  : ${err.keyValue.email}  entered `;
        err = new ErrorHandler(message, 400);   
    }

    res.status(err.statusCode).json({
        success:false,
        error: err.message,
    })
}




module.exports=errorController;



