const express = require("express");

const db = require("./db.js");

const router = express.Router();

router.post("/", (req, res) => {
    const blogPost = req.body;
    console.log(blogPost);
    if (!blogPost.title || !blogPost.contents) {
        return res.status(400).json({
            success: false,
            errorMessage: "Please provide title and contents for the post."
        })
    }

    db.insert(blogPost)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: "There was an error while saving the post to the database"
            });
        });
});

module.exports = router
