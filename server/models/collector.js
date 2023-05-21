const { error } = require("console");
const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const collectorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email already exists"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new error("Invalid E-mail id");
            }
        }

    },
    mobile:{
        type:Number,
        required:true,
        unique:[true,"User with this Number already exists"],
        min:1000000000,
        max:9999999999
    },
    password:{
        type: String,
        required: true,
        minlength: 4,
        maxlength: 16
    },
    tokens:[{
        token:String,
        // required:true
    }]

})
collectorSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id},process.env.JWT_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        res.send(err);
    }
}
const Collector = mongoose.model("Collector",collectorSchema);
module.exports = Collector;