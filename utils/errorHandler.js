class ErrorHandler extends Error{
    constructor(message , statusCode ){
        super(message);
        this.statusCode=statusCode;
        // console.log("THIS"+this)
        Error.captureStackTrace(this,constructor);

    }
}
module.exports = ErrorHandler;