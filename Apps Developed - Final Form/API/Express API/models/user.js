const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        Required : true
    },
    password : {
        type: String,
        Required : true
    },
    name : {
        type: String,
        Required : true
    },
    status : {
        type: String,
        default : "I am new!"
    },
    posts : {
        type: [
            {
                post : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : 'Post'
                }
            }
        ]
    }
}) 

module.exports = mongoose.model("User", userSchema);