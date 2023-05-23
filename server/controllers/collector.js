const Collector = require("../models/collector");
const Food = require("../models/food");
const Provider = require("../models/provider");
const nodemailer = require("nodemailer");

const signup = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ error: "Enter all fields" });
        }

        const emailExists = await Collector.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const NewCollector = new Collector({
            name,
            email,
            mobile,
            password,
        });

        const CollectorCreated = await NewCollector.save();
        const token = await CollectorCreated.generateAuthToken();
        console.log(token);
        res.cookie("jwt", token, { httpOnly: true });
        res.json(CollectorCreated);
    } catch (err) {
        res.status(500).json({ error: "An error occurred during signup. Please try again." });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Enter all the fields" });
        }

        const user = await Collector.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User doesn't exist" });
        }

        if (password === user.password) {
            const token = await user.generateAuthToken();
            console.log(token);
            res.cookie("jwt", token, { httpOnly: true });
            res.send(user);
        } else {
            return res.status(400).json({ error: "Invalid details" });
        }
    } catch (err) {
        res.status(500).json({ error: "An error occurred during signin. Please try again." });
    }
};

const search = async(req,res)=>{
    try {
        const name = req.params.name;
        const tag = req.params.name;
        const findFood = await Food.find({$or:[{name},{tag}]}).populate("providerId","-password");
        const pointLat = req.body.latitude;
        const pointLong =req.body.longitude;
        // console.log(findFood[0].providerId.location.coordinates[0]);
        findFood.sort((seller1, seller2) => {
            console.log(seller2);
            const lat1 = seller1.providerId.location.coordinates[0];
            const long1 = seller1.providerId.location.coordinates[1];
            const lat2 = seller2.providerId.location.coordinates[0];
            const long2 = seller2.providerId.location.coordinates[1];
        
            // Calculate the distance between each seller's location and the particular point using the Haversine formula
            const distance1 = getDistanceFromLatLonInKm(lat1, long1, pointLat, pointLong);
            const distance2 = getDistanceFromLatLonInKm(lat2, long2, pointLat, pointLong);
            // if (distance1 > 5 || distance2 > 5) {
            //     return 0;
            // }
        
            return distance1 - distance2;
        });
        
        
        // Function to calculate the distance between two points using the Haversine formula
        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radius of the earth in km
            const dLat = deg2rad(lat2 - lat1);
            const dLon = deg2rad(lon2 - lon1);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c; // Distance in km
            return d;
        }
        
        // Function to convert degrees to radians
        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }
       res.send(findFood);

    } catch (error) {
        res.send(error);
    }
}
const SignOut = async(req,res,next)=>{
    try {
        res.clearCookie('jwt');
        next()
        console.log("This is to be done");

    } catch (error) {
        
    }
}

const getall = async(req,res)=>{
    try {
        
        const findFood = await Food.find({expiryDate:{$gte : Date.now()}}).populate("providerId","-password");
        const pointLat = req.body.latitude;
        const pointLong =req.body.longitude;
        // console.log(findFood[0].providerId.location.coordinates[0]);
        findFood.sort((seller1, seller2) => {
            console.log(seller2);
            const lat1 = seller1.providerId.location.coordinates[0];
            const long1 = seller1.providerId.location.coordinates[1];
            const lat2 = seller2.providerId.location.coordinates[0];
            const long2 = seller2.providerId.location.coordinates[1];
        
            // Calculate the distance between each seller's location and the particular point using the Haversine formula
            const distance1 = getDistanceFromLatLonInKm(lat1, long1, pointLat, pointLong);
            const distance2 = getDistanceFromLatLonInKm(lat2, long2, pointLat, pointLong);
            // if (distance1 > 5 || distance2 > 5) {
            //     return 0;
            // }
        
            return distance1 - distance2;
        });
        
        
        // Function to calculate the distance between two points using the Haversine formula
        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radius of the earth in km
            const dLat = deg2rad(lat2 - lat1);
            const dLon = deg2rad(lon2 - lon1);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c; // Distance in km
            return d;
        }
        
        // Function to convert degrees to radians
        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }
       res.send(findFood);

    } catch (error) {
        res.send(error);
    }
}
const sendMail = async(req,res)=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_ID, // Replace with your Gmail email address
          pass: process.env.PASS, // Replace with your Gmail email password
        },
      });
      const mailOptions = {
        from: "mihirdesh23@gmail.com", // Replace with your Gmail email address
        to: `${req.params.email}`, // Replace with recipient email address
        subject: "Welcome to FeedNeedy", // Replace with subject of your email
        html: `<h4>Hello ${req.params.name}</h4><br><p>We would like to inform you that we have got a request for your food ${req.params.food}.
        The Details of the Requestor is as follows: <br>
        Name : ${req.user.name}<br>
        Mobile : ${req.user.mobile}<br>
        Email : ${req.user.email}</p>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).json({ Error: error });
          console.log(error);
        } else {
          res.status(200).json({ "Email sent successfully": info.response });
          console.log("Email Sent");
        }
      });
}
const getinfo = async(req,res)=>{
    try{
       res.send(req.user);
    }catch(err){
        console.log(err);
    }
}
module.exports = {signup,signin,search,SignOut,getall,sendMail,getinfo};