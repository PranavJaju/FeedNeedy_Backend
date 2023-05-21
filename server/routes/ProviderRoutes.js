const express = require("express");
const Auth = require("../middlewares/ShopAuth");
const P_Routes = express.Router();
const {SignUp, SignIn , DonateFood,SeeItems,Search,UpdateFood,DeleteFood,expiry,ViewOthers} = require("../controllers/provider");
P_Routes.post("/RegisterD",SignUp);
P_Routes.post("/loginD",SignIn);
P_Routes.post("/AddItem",Auth,DonateFood);
P_Routes.get("/SeeItems",Auth,SeeItems);
P_Routes.get("/Search/:name",Auth,Search);
P_Routes.patch("/UpdateFood/:id",Auth,UpdateFood);
P_Routes.delete("/DeleteFood/:id",Auth,DeleteFood);
P_Routes.get("/ViewExpired",Auth,expiry)
P_Routes.get("/Recieve/:name",Auth,ViewOthers);
module.exports = P_Routes;