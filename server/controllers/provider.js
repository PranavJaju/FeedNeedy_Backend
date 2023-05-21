const Provider = require("../models/provider");
const Food = require("../models/food");
const SignUp = async(req,res)=>{
    try{
        const {name,email,password,mobile,address} = req.body;
        if(!name || !email || !password || !mobile || !address){
            res.send("Enter all fields");
        }
        const NewProvider = new Provider({
            name,email,mobile,address,password,
            location:{
                type:"Point",
                coordinates: [req.body.latitude,req.body.longitude],
            }
        })
        console.log("hello");
        const SaveProvider = await NewProvider.save();
        const token = await SaveProvider.generateAuthToken();
        console.log(token);
        res.cookie('jwt',token,{httpOnly:true})
        res.send(SaveProvider);
    }catch(err){res.status(500).send(err);console.log(err);}
}

const SignIn = async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        if(!email || !password){
            res.send("Enter All the fields");
        }
        else{
            const UserFound = await Provider.findOne({email});
            if(UserFound == null){
                res.send("User Doesn't Exists");
            }
            else{
                if(password===UserFound.password){
                    const token = await UserFound.generateAuthToken();
                    console.log(token);
                    res.cookie('jwt',token,{httpOnly:true})
                    res.send(UserFound);
                }
                else{
                    res.send("Invalid Details");
                }
            }
        }
    }catch(err){res.send(err)}
}
const DonateFood = async(req,res)=>{
    try{
        const {name,quantity,tag,expiryDate} = req.body;
        if(!name || !quantity || !tag || !expiryDate){
            res.send("Please fill all the fields");
        }
        else{
            const AddItem  = new Food({
                name,quantity,expiryDate,tag,
                providerId:req.user._id
            })
            const saveItem = await AddItem.save();
            res.send(saveItem);
        }

    }catch(err){res.send(err)};
}

const SeeItems = async(req,res)=>{
    try{
        const Items = await Food.find({providerId:req.user._id,expiryDate:{$gte : Date.now()}}).populate("providerId","-password");
        res.send(Items);
    }catch(err){
        res.send(err);
    }
}

const Search = async(req,res)=>{
    try{
      const name = req.params.name;
      const Items = await Food.find({name,providerId:req.user._id}).populate("providerId","-password");
      res.send(Items);

    }catch(err){
        res.send(err);
    }
}

const UpdateFood = async(req,res)=>{
    try{
        const id = req.params.id;
        const Items = await Food.findByIdAndUpdate({_id:id},req.body,{new:true});
        res.send(Items);

    }catch(err){
        res.send(err);
    }
}

const DeleteFood = async(req,res)=>{
    try{
        const id = req.params.id;
        const Items = await Food.findByIdAndDelete({_id:id},{new:true});
        res.send(Items);

    }catch(err){
        res.send(err);
    }
}

const expiry = async(req,res)=>{
    try{
        const Items = await Food.find({providerId:req.user._id,expiryDate:{$lte : Date.now()}});
        res.send(Items);
    }catch(err){res.send(err);}
}

const ViewOthers = async(req,res)=>{
    try{
        const name = req.params.name;
        const Items = await Food.find({name,providerId:{$ne:req.user._id}});
        res.send(Items);
    }catch(err){res.send(err);}
}
const SignOut = async(req,res)=>{
    try {
        res.clearCookie('jwt');
        console.log("This is to be done");

    } catch (error) {
        
    }
}

module.exports = {SignUp,SignIn,DonateFood,SeeItems,Search,UpdateFood,DeleteFood,expiry,ViewOthers};