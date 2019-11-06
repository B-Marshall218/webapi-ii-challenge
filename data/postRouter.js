const express = require("express");

const db = require("./db.js");

const router = express.Router();



router.post("/", (req, res) => {
    const blogPost = req.body;
    console.log(blogPost);
    if (!blogPost || !blogPost.title || !blogPost.contents) {
        return res.status(400).json({
            success: false,
            errorMessage: "Please provide title and contents for the post."
        })
    } else {

        db.insert(blogPost)
            .then(({ id }) => {
                db.findById(id)
                    .then(post => {
                        res.status(201).json(post);
                    })


            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: "There was an error while saving the post to the database"
                });
            });
    }
});

router.post("/:id/comments", (req, res) => {
    const comments = { ...req.body, post_id: req.params.id }
    const { id } = req.params.id;

    if (!comments.text) {
        res.status(400).json({
            errorMessage: "Please provide text for the comment"
        })
    } else {

        db.findById(id)
            .then(() => {
                db.insertComment(comments)
                    .then(comments => {
                        res.status(201).json(comments); //why does putting the comment here work? 
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: "there was an error while saving the comment to the data base",
                            success: false
                        })
                    })

            })

    }

})

router.get("/", (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({
                error: "The posts information could not be retrieved"
            });
        })
})

router.get("/:id/comments", (req, res) => {
    const { id } = req.params;
    db.findPostComments(id)
        .then(comments => {
            if (!comments) {
                return res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
            res.status(200).json(comments)
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: "The post with the specified ID does not exist."
            })
        })

})

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json({
            message: "The post with the specified ID does not exist."
        })
    }

    db.remove(id)
        .then(deletedId => {
            if (deletedId) {
                res.status(202).json({ success: true })
            } else {
                res.status(404).json({
                    message: "Seriously? Again? The post with the specified ID does not exist."
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "The post could not be removed"
            })
        })
})

router.put("/:id", (req, res) => {
    const postInfo = req.body
    const id = req.params.id

    if (!postInfo.title || !postInfo.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post.",
            success: false
        })
    } else {
        db.findById(id)
            .then(() => {
                db.update(id, postInfo) //how do you know when to use .params
                    .then(postInfo => {
                        if (postInfo) {
                            res.status(200).json(postInfo)
                        } else {
                            res.status(404).json({
                                message: "The post with the specified ID does not exist."
                            })
                        }
                    })
            })

            .catch(err => {
                res.status(500).json({
                    error: "The post information could not be modified."
                })
            })
    }
})
module.exports = router
