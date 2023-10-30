const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const jwt = require('jsonwebtoken');

// Register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.create({
            username, email, password
        });

        const token = user.getJwtToken();

        const options = {
            expires: new Date(
                Date.now() + 1 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };

        res.status(201).cookie('token', token, options).json({
            success: true,
            user,
            token
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            console.log("User Not Exist")
        }

        const isPasswordMatch = user.comparePassword(password);

        if (!isPasswordMatch) {
            console.log("User Not Exist")
        }

        const token = user.getJwtToken();

        const options = {
            expires: new Date(
                Date.now() + 1 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };

        res.status(201).cookie('token', token, options).json({
            success: true,
            user,
            token
        });
    } catch (error) {
        res.status(500).json(error);
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