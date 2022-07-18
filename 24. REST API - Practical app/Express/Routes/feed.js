const express = require("express");
const {body} = require("express-validator");
const feedController = require("../controller/feed");

const router = express.Router();
/* GET */

// /feed/posts
router.get("/posts", feedController.getPosts);
// /feed/post/:ID
router.get("/post/:postId", feedController.getPost);


/* POST */

// /feed/post
router.post("/post",
[
    body("title", "Enter a valid title")
    .trim()
    .isLength({min : 5}),
    body("content", "Enter a valid content")
    .trim()
    .isLength({min : 5})
],
feedController.createPost);

/* PUT */

// /feed/post/:postId
router.put("/post/:postId",
[
    body("title", "Enter a valid title")
    .trim()
    .isLength({min : 5}),
    body("content", "Enter a valid content")
    .trim()
    .isLength({min : 5})
],
feedController.updatePost);


/* DELETE */

// /feed/post/:postId
router.delete("/post/:postId", feedController.deletePost);

module.exports = router;