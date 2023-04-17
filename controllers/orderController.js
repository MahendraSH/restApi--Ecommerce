const Order = require('../models/orderModels');
const Product = require('../models/productsModels');
const User = require('../models/userModels');

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/featuersORquery");



//  createNewOrder
const createNewOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        TotalPrice, } = req.body;

    const order = await Order.create({

        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        TotalPrice,
        paidAt: Date.now(),
        user: req.user._id,

    });

    res.status(201).json(
        {
            success: true,
            order,
        }
    )
})

// get single order 

const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    if (!req.params.id) {

        return next(new ErrorHandler("required params order id "));
    }
    const order = await Order.findById(req.params.id)
        .populate(
            "user",
            "name , email"
        );

    if (!order) {
        return next(new ErrorHandler(`order not found with id : ${req.params.id}`, 404))
    }
    res.status(201).json(
        {
            success: true,
            order,
        }
    )

});

//  get all orders of logged in user 

const getMyOrders = catchAsyncErrors(async (req, res, next) => {


    const orders = await Order.find({ user: req.user._id });


    res.status(201).json(
        {
            success: true,
            orders,
        }
    )

});

//  get all orders 

const getAllOrders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find();
    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.TotalPrice;
    })

    res.status(201).json(
        {
            success: true,
            totalAmount,
            orders,
        }
    )

});
// update order status --admin
const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {


    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler(`order not found with id : ${req.params.id}`, 404))
    }

    if (order.orderStatus ==='Delivered'){
        return next(new ErrorHandler(("you have already delivered this oreder ", 404)));

    }

    order.orderItems.forEach( async item=>{
        await updateStock(item.product, item.quantity);

         });

    order.orderStatus=req.body.status;

    if (req.body.status === "Delivered"){
        order.deliveredAt =Date.now();
    }
await order.save({validateBeforeSave:false})
        res.status(201).json(
            {
                success: true,

            }
        )


   async   function updateStock (id ,quantity){
           const product =await Product.findById(id);
           product.Stock-=quantity;

           await product.save({
            validateBeforeSave:true
           })
   }
});



module.exports = {
    createNewOrder,
    getSingleOrder,
    getMyOrders,
    getAllOrders,
}