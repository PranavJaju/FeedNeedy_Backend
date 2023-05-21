const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require("cors")
const port = process.env.PORT || 5000;
const dotenv = require("dotenv")
dotenv.config()
require("../db/connection");
const PRoutes = require("../routes/ProviderRoutes");
const CRoutes = require("../routes/CollectorRoutes");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(cors());
app.use(CRoutes);
app.use(PRoutes);
app.listen(port,()=>{
    console.log(`Connected to port : ${port}`);
})