const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const verifyToken = require("../VerifyToken");

// Update
router.put("/update/:id", async (req, res) => {
    try {
        const id = req.params.id
        const newUserData = {
            username: req.body.username,
            email: req.body.email
        };
        const user = await User.findByIdAndUpdate(id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: true
        });

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete
router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return "user not found"
        }

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get User
router.get("/me",async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router