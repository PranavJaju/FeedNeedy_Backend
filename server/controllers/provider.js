const Provider = require("../models/provider");
const Food = require("../models/food");

const SignUp = async (req, res) => {
    try {
      const { name, email, password, mobile, address } = req.body;
  
      if (!name || !email || !password || !mobile || !address) {
        return res.status(400).json({ error: "Enter all fields" });
      }
  
      const existingProvider = await Provider.findOne({ email });
      if (existingProvider) {
        return res.status(400).json({ error: "Email already exists" });
      }
  
      const NewProvider = new Provider({
        name,email,mobile,address,password,
        location: {
          type: "Point",
          coordinates: [req.body.latitude, req.body.longitude],
        },
      });
  
      console.log("hello");
      const SaveProvider = await NewProvider.save();
      const token = await SaveProvider.generateAuthToken();
      console.log(token);
      res.cookie("jwt", token, { httpOnly: true });
      res.json(SaveProvider);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "An error occurred during sign up. Please try again." });
    }
  };
  
const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Enter all fields" });
        } else {
            const UserFound = await Provider.findOne({ email });
            if (!UserFound) {
                return res.status(400).json({ error: "User doesn't exist" });
            } else {
                if (password === UserFound.password) {
                    const token = await UserFound.generateAuthToken();
                    console.log(token);
                    res.cookie("jwt", token, { httpOnly: true });
                    res.json(UserFound);
                } else {
                    return res.status(400).json({ error: "Invalid details" });
                }
            }
        }
    } catch (err) {
        res.status(500).json({ error: "An error occurred during sign in. Please try again." });
    }
};

const DonateFood = async (req, res) => {
    try {
      const { name, quantity, tag, expiryDate } = req.body;
  
      // Check if any required field is missing
      if (!name || !quantity || !tag || !expiryDate) {
        return res.status(400).json("Please fill all the fields");
      }
  
      // Check if quantity is positive
      if (quantity <= 0) {
        return res.status(400).json("Quantity must be positive");
      }
  
      // Check if expiry date is in the future
      const currentDate = new Date();
      const selectedDate = new Date(expiryDate);
      if (selectedDate <= currentDate) {
        return res.status(400).json("Expiry date must be in the future");
      }
  
      const AddItem = new Food({
        name,
        quantity,
        expiryDate,
        tag,
        providerId: req.user._id,
      });
  
      const saveItem = await AddItem.save();
      res.json(saveItem);
    } catch (err) {
      console.log(err);
      res.status(500).json("Internal Server Error");
    }
  };
  
const SeeItems = async (req, res) => {
    try {
        const Items = await Food.find({ providerId: req.user._id, expiryDate: { $gte: Date.now() } }).populate("providerId", "-password");
        res.send(Items);
    } catch (err) {
        res.send(err);
    }
}

const Search = async (req, res) => {
    try {
        const name = req.params.name;
        const Items = await Food.find({ name, providerId: req.user._id }).populate("providerId", "-password");
        res.send(Items);

    } catch (err) {
        res.send(err);
    }
}

const UpdateFood = async (req, res) => {
    try {
        const id = req.params.id;
        const Items = await Food.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        res.send(Items);

    } catch (err) {
        res.send(err);
    }
}

const DeleteFood = async (req, res) => {
    try {
        const id = req.params.id;
        const Items = await Food.findByIdAndDelete({ _id: id }, { new: true });
        res.send(Items);

    } catch (err) {
        res.send(err);
    }
}

const expiry = async (req, res) => {
    try {
        const Items = await Food.find({ providerId: req.user._id, expiryDate: { $lte: Date.now() } });
        res.send(Items);
    } catch (err) { res.send(err); }
}

const ViewOthers = async (req, res) => {
    try {
        const name = req.params.name;
        const Items = await Food.find({ name, providerId: { $ne: req.user._id } });
        res.send(Items);
    } catch (err) { res.send(err); }
}
const SignOut = async (req, res) => {
    try {
        res.clearCookie('jwt');
        console.log("This is to be done");

    } catch (error) {
        console.log(err);
    }
}
const getinfo = async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        console.log(err);
    }
}

module.exports = { SignUp, SignIn, DonateFood, SeeItems, Search, UpdateFood, DeleteFood, expiry, ViewOthers, getinfo };