const express = require("express");
const {body} = require("express-validator");
const feedController = require("../controller/feed");
const isAuth = require ("../middleware/is-auth");

const router = express.Router();
/* GET */

// /feed/posts
router.get("/posts", isAuth, feedController.getPosts);
// /feed/post/:ID
router.get("/post/:postId", isAuth, feedController.getPost);

/* POST */

// /feed/post
router.post("/post",
isAuth,
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
isAuth,

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
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;