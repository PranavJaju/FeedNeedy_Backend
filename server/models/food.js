const { error } = require("console");
const mongoose = require("mongoose")
const foodSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    quantity:{
        type:Number,
        required:true,
    },
    expiryDate:{
        type:Date,
        required:true,
    },
    tag:{
        type:String,
        required:true
    },
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Provider"
    }
    
})
const Food = mongoose.model("Food",foodSchema);
module.exports = Food;