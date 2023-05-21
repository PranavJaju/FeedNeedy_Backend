
const Provider = require("../models/provider");
const jwt = require("jsonwebtoken");
const AuthProvider = async(req,res,next)=>{
   try{
      const token = req.cookies.jwt; // Assuming the token is stored in a cookie named "jwt"

      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      let verifyUser;
      try {
        verifyUser = jwt.verify(token, process.env.JWT_KEY);
      } catch (err) {
        throw new Error('Invalid token');
      }
  
      if (!verifyUser._id) {
        throw new Error('Invalid token');
      }
    req.user = await Provider.findOne({_id:verifyUser._id});
    next();
   }catch(err){
    res.send(err+"Authentication failed");
   }
}
module.exports = AuthProvider;