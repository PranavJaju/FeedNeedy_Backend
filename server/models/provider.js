const { error } = require("console");
const mongoose = require("mongoose")
const validator = require("validator");
const jwt = require("jsonwebtoken");
const providerSchema = mongoose.Schema({
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
    address:{
        type:String,
        required:true
    },
    location:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    tokens:[{token:String}]
})
providerSchema.index({location:"2dsphere"});
providerSchema.methods.generateAuthToken = async function(){
     try{
        const token = jwt.sign({_id:this._id},process.env.JWT_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
     }catch(err){
        res.send(err);
        console.log(err)
     }
}
const Provider = new mongoose.model("Provider",providerSchema);
module.exports = Provider;