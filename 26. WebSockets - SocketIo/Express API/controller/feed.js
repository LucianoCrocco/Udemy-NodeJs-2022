const {validationResult} = require("express-validator");
const PostModel = require("../models/post");
const UserModel = require("../models/user");
const fs = require("fs");
const path = require("path");

/* GET */
exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2; //Same as frontend
    try {
        const totalItems = await PostModel.countDocuments()
        const posts = await PostModel.find().populate("creator").skip((currentPage - 1) * perPage).limit(perPage);
        if(!posts){
            const error = new Error("Could not find posts.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message : 'Fetched posts successfully.',
            posts : posts,
            totalItems : totalItems
        })
    }catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await PostModel.findById(postId);
        if(!post){
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message : 'Post fetched.',
            post : post
        })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


/* POST */
exports.createPost = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }

    if(!req.file){
        const error = new Error("No image provided");
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\" ,"/");
    // console.log(title + " " + content);
    //Create post in db
    const post = new PostModel({
        title : title,
        content : content,
        imageUrl : imageUrl,
        creator : req.userId
    })

    try {
        await post.save();
        const user = await UserModel.findById(req.userId);
        const creator = user;
        user.posts.push(post);
        await user.save();
        res.status(201).json({
            message : "Post created successfully",
            post: post,
            creator : {_id : creator._id, name : creator.name}
        });
    } catch (err) {
        clearImage(imageUrl);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

/* PUT */
exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if(req.file){
        imageUrl = req.file.path.replace("\\" ,"/");
    }

    if(!imageUrl) {
        const error = new Error("No file picked");
        error.statusCode = 422;
        throw error;
    }
    
    try{
        const post = await PostModel.findById(postId);
        if(!post){
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error; 
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error("Not authorized.");
            error.statusCode = 403;
            throw error; 
        }
        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        await post.save();
        res.status(200).json({
            message : "Post updated!",
            post: result
        });
    }catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

/* DELETE */

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await PostModel.findById(postId);
        if(!post){
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error; 
        
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error("Not authorized.");
            error.statusCode = 403;
            throw error; 
        }
        clearImage(post.imageUrl);
        await PostModel.findByIdAndRemove(postId);
        const user = await UserModel.findById(req.userId);
        user.posts.pull(postId); // Agarra un elemento de la coleccion que coincida con el Id y lo borra.
        await user.save();
        res.status(200).json({
            message : "Post deleted."
        });
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

/* Functions */
const clearImage = filePath => {
    filePath = path.join(__dirname, "..", filePath)
    fs.unlink(filePath, err => console.log(err));
}