
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Product = require("../models/productsModels");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/featuersORquery");

// create the product --admin

const createProduct = catchAsyncErrors(async (req, res) => {


    req.body.user = req.user._id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    })

});
// to get all products

const getAllProducts = catchAsyncErrors(async (req, res) => {

    const ResultPerPage = 4;
    const apifeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagnination(ResultPerPage);
    const products = await apifeature.query;
    res.status(200).json({
        success: true,
        products,
    })
});

// to get product by id 
const getProductById = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("product not found", 404))

    }


    res.status(200).json({
        success: true,
        product
    })


});

// update product by id  --admin

const updateProductById = catchAsyncErrors(async (req, res, next) => {


    const product = await Product.findById(req.params.id);

    if (!product) {

        return next(new ErrorHandler("product not found", 404))

    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        product,
        updatedProduct,

    })

    // const id = req.params.id;
    // res.status(200).json({id})
});

const deleteProductByid = catchAsyncErrors(async (req, res, next) => {


    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("product not found", 404))



    }
    await Product.deleteOne(product);


    res.status(200).json({
        success: true,
        message: "product deleted succesfully ",
    })

});

//  product reviews  
//  create  reviews  and update reviews 

const createUpdateReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    if (!productId || !rating) {
        return next(new ErrorHandler("required: productId : please enter product id and and rating: please enter the rating ", 400))
    }
    const review = {
        user: req.user._id,
        nameOfReviewer: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler(` product not found  with productId:${productId} `, 404));
    }
    const isReviewed = product.reviews.find(rev => String(rev.user) === String(req.user._id))
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if ((String(rev.user)) === (String(req.user._id))) {
                rev.rating = review.rating;
                rev.comment = review.comment;

            }
        });
    }
    else {
        product.reviews.push(review);
        product.noOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating;
    });
    product.ratings = avg / product.noOfReviews
    await product.save();
    res.status(200).json({
        success: true,
        message: "review added succesfully"
    })
})


//  get All reviews of a single product 
const getReviewsOfAProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("product not found", 404))

    }


    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })


});
// deleteReviw 
const deleteReviewByProductAndReviewId = catchAsyncErrors(async (req, res, next) => {

    if (!req.query.id || !req.query.productId) {
        return next(new ErrorHandler("required : productId : plesase enter product id , id : please enter review id  ", 400))

    }

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("product not found", 404))

    }

    const reviews = product.reviews.filter(rev => String(rev._id) !== String(req.query.id));


    //save to db 
    if (reviews.length !== 0) {

        const noOfReviews = reviews.length;
        let avg = 0;
        reviews.forEach(rev => {
            avg += rev.rating;
        });

        const ratings = avg / noOfReviews
        product.ratings = ratings;
        product.noOfReviews = noOfReviews;
        product.reviews = reviews;
        await product.save();


    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})



module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductByid,
    createUpdateReview,
    getReviewsOfAProduct,
    deleteReviewByProductAndReviewId
}