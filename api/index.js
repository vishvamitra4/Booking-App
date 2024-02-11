const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const User = require("./models/User");
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

const app = express();
// middleware..
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Booking");

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("hello world!");
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, salt),
        });
        res.send(userDoc);
    }catch(e){
        res.json({msg : "email already register!"});
    }
    
})

app.post("/login" , async (req , res)=>{
    const {email , password} = req.body;
    try
    {
        const userDoc = await User.findOne({email});
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            res.json(userDoc);
        }else{
            res.json({message : "Password is Wrong!"})
        }
    }catch(e){
        res.json({message : "Email Does Not Exist!"});
    };
})

app.listen(port, () => {
    console.log("Server is Listening on", port);
})