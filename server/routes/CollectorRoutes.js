const express = require("express")
const {signup,signin,search, SignOut, getall,sendMail,getinfo} = require("../controllers/collector");
const Auth = require("../middlewares/CAuth");
const C_Routes = express.Router();
C_Routes.post("/registerR",signup);
C_Routes.post("/loginR",signin);
C_Routes.get("/find/:name",Auth,search);
C_Routes.get("/find",getall)
C_Routes.post("/logout",Auth,SignOut);
C_Routes.post("/mail/:name/:email/:food",Auth,sendMail);
C_Routes.get("/viewProfile",Auth,getinfo)
module.exports = C_Routes;