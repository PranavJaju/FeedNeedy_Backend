const mongoose = require("mongoose");
mongoose.set('strictQuery', false)
mongoose.connect(process.env.CONNECTION_KEY).then(()=>{
    console.log(`connection with DataBase `)
}).catch((err)=>{
    console.log(err)
});
