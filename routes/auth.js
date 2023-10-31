const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {

    const { username, email, password } = req.body;
    try {
        // Existing user checking
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exist"
            });
        };

        const hashPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            username: username,
            email: email,
            password: hashPassword
        });

        const token = jwt.sign({ email: result.email, id: result._id }, "SECRET_KEY");

        res.status(201).json({
            user: result,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" })
    }
});

// Login
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({
                message: "User Not Found"
            });
        };

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid User" });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "SECRET_KEY");

        res.status(201).json({
            user: existingUser,
            token: token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" })
    }
});

// Logout
router.get("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })

        res.status(200).json({
            message: "Logout Successfully"
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Refetch User
router.get("/refetch", async (req, res) => {
    const token = req.cookies.token;

    jwt.verify(token, process.env.SECRET, (err, data) => {
        if (err) {
            return res.status(401).json({ error: 'Token verification failed' });
        }
        res.status(200).json(data);
    });

});

module.exports = router