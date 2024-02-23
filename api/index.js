const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const User = require("./models/User");
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

const app = express();
// middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials : true,
}
))
app.use(express.json());
app.use(cookieParser());

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
    } catch (e) {
        res.json({ msg: "email already register!" });
    }

})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            })
        } else {
            res.json("Pass Not Okay!");
        }
    } else {
        res.json("Not Found!");
    }

});

app.get("/profile", (req, res) => {
    const { token } = req.cookies;
    if(token){
        jwt.verify(token , jwtSecret , {} , async (err , user)=>{
            if(err) throw err;
            const userInfo = await User.findById(user.id);
            res.json(userInfo);
        })
    }else res.json(null);
})

app.post("/logout" , (req , res)=>{
    res.cookie('token' , '').json(true);
})



app.listen(port, () => {
    console.log("Server is Listening on", port);
})