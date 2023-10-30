const express = require("express");
const router = express.Router();
const Post = require("../models/PostSchema");
const verifyToken = require("../VerifyToken");


// Create
router.post("/create", async (req, res) => {
    try {
        const { title, desc, username, userId, categories } = req.body;
        const post = await Post.create({
            title, desc, username, userId, categories
        })
        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update
router.put("/update/:id", async (req, res) => {
    try {
        const id = req.params.id
    
        const post = await Post.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: true
        });

        res.status(200).json({
            success: true,
            post
        })
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete
router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id
        const post = await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message:"post delete"
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get Post
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const post = await Post.findById(id);

        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get user Post
router.get("/user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await Post.find({userId});

        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get Posts
router.get("/", async (req, res) => {
    try {
        
        const posts = await Post.find();

        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router