const {validationResult} = require("express-validator");
const PostModel = require("../models/post");
const UserModel = require("../models/user");
const fs = require("fs");
const path = require("path");

/* GET */
exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2; //Same as frontend
    let totalItems;
    PostModel.countDocuments()
    .then(count => {
        totalItems = count;
        return PostModel.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
        if(!posts){
            const error = new Error("Could not find posts.");
            error.statusCode = 404;
            throw error; //el .catch lo agarra.
        }
        res.status(200).json({
            message : 'Fetched posts successfully.',
            posts : posts,
            totalItems : totalItems
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    PostModel.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error; //el .catch lo agarra.
        }
        res.status(200).json({
            message : 'Post fetched.',
            post : post
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}


/* POST */
exports.createPost = (req,res,next) => {
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
    let creator;
    // console.log(title + " " + content);
    //Create post in db
    const post = new PostModel({
        title : title,
        content : content,
        imageUrl : imageUrl,
        creator : req.userId
    })

    post.save()
    .then(result => {
        return UserModel.findById(req.userId)
    })
    .then(user => {
        creator = user;
        user.posts.push(post);
        return user.save()
    })
    .then(result => {
        res.status(201).json({
            message : "Post created successfully",
            post: post,
            creator : {_id : creator._id, name : creator.name}
        });
    })
    .catch(err => {
        clearImage(imageUrl);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

/* PUT */
exports.updatePost = (req, res, next) => {
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
    
    PostModel.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error; //el .catch lo agarra.
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error("Not authorized.");
            error.statusCode = 403;
            throw error; //el .catch lo agarra.
        }

        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message : "Post updated!",
            post: result
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

/* DELETE */

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    PostModel.findById(postId)
    .then(post => {
        //Check loggin user
        if(!post){
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error; //el .catch lo agarra.
        
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error("Not authorized.");
            error.statusCode = 403;
            throw error; //el .catch lo agarra.
        }
        clearImage(post.imageUrl);
        return PostModel.findByIdAndRemove(postId);
    })
    .then(result => {
        return UserModel.findById(req.userId)
    })
    .then(user => {
        user.posts.pull(postId); // Agarra un elemento de la coleccion que coincida con el Id y lo borra.
        return user.save();
    })
    .then(result => {
        res.status(200).json({
            message : "Post deleted."
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

/* Functions */
const clearImage = filePath => {
    filePath = path.join(__dirname, "..", filePath)
    fs.unlink(filePath, err => console.log(err));
}