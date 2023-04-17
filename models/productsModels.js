const mongoose = require('mongoose')


const productShema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter the product name "],
        trim: true,
    },
    discription: {

        type: String,
        required: [true, "please enter the   product  discription "],
    },
    price: {
        type: Number,
        required: [true, "please enter the product price "],
        maxLength: [8, "the product price cannot exceed 8 characters"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
                // require: [true, "image public_id  not found"],
            },
            url: {
                type: String,
                required: true,
                // require: [true, "image url not found not found"],
            },
        }
    ],
    category: {
        type: String,
        require: [true, "please enter the product catagory  "],

    },
    stock: {
        type: Number,
        default: 1,
        maxLength: [4, "stock length cannot exceed 4 characters"],
    },
    noOfReviews: {
        type: Number,
        default: 0,

    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
            nameOfReviewer: {
                type: String,
                required: true,
            },
            rating: {

                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            }
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    created: {
        type: Date,
        default: Date.now,
    },


});

module.exports = mongoose.model('Product', productShema);
