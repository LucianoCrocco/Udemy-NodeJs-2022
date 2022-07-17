const {validationResult} = require("express-validator");

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts : [
            {
                _id : '1',
                title : "First Post",
                content : "This is the first post",
                imageUrl : "images/doom.png",
                creator : {
                    name : "Luciano",
                },
                createdAt : new Date(),
            }
        ]
    });
}

exports.createPost = (req,res,next) => {
    const title = req.body.title;
    const content = req.body.content;
    const errores = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            message : 'Validation failed, entered data is incorrect.',
            errors : errors.array()
        })
    }

    // console.log(title + " " + content);
    //Create post in db
    res.status(201).json({
        message : "Post created successfully",
        post: {
            _id : Date.now(),
            title : title,
            content : content,
            creator : {
                name : "Luciano"
            },
            createdAt : new Date()
        }
    })
}