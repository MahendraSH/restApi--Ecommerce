const mongoose = require("mongoose");
const Validator = require("validator");
const bcrypt = require('bcryptjs')

const jwt = require("jsonwebtoken")
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please  enter the name "],
        maxLength: [30, "name can not have more then 30 characters"],
        minLength: [3, "name must be aleast contain 3 characters"],

    },

    email: {
        type: String,
        required: [true, "please enter the email "],
        unique: true,
        validate: [Validator.isEmail, "please  enter a valid email address "],
    },
    password: {
        type: String,
        required: [true, "please enter the passowrd"],
        minLength: [8, "The passowrd must be at least 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },

    },
    role: {
        type: String,
        default: 'user',
    },
    resetPasswordToken: String,
    restPasswordExpire: Date,

})
// bcrypt password crytion using hashing 
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);

})

// console.log(`process.env.jwt_secrect ${process.env.jwt_secrect} and process.env.jwt_expire_time ${process.env.jwt_expire_time} `);
//  jwt token generateror for 

userSchema.methods.generateWebToken = async function(){
    return  jwt.sign({ id: this._id }, process.env.jwt_secrect);

};

// comapare passwords

userSchema.methods.matchPassword = async function(passowrd){
  
    return bcrypt.compare(passowrd, this.password);
};


//  genreate rested token using crypto
userSchema.methods.generateResetToken= function (){
    const restToken = crypto.randomBytes(Number(process.env.crytoToken_Random_bufferSize)).toString('hex');
    this.resetPasswordToken =crypto.createHash(process.env.crypto_algo).update(restToken).digest('hex');
    this.restPasswordExpire=new Date(Date.now()+15*60*1000);

    return restToken;
}

module.exports = mongoose.model("User", userSchema);