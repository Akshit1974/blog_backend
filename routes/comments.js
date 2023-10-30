const express = require("express");
const router = express.Router();
const Comment = require("../models/CommentSchema");


// Create
router.post("/create", async (req, res) => {
    try {
        const { comment, author, postId, userId } = req.body;
        const post = await Comment.create({
            comment, author, postId, userId
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
    
        const post = await Comment.findByIdAndUpdate(id, req.body, {
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
        const post = await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message:"post delete"
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router