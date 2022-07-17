const express = require("express");
const {body} = require("express-validator");
const feedController = require("../controller/feed");

const router = express.Router();

//GET /feed/posts
router.get("/posts", feedController.getPosts);

//POST /feed/post
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

module.exports = router;