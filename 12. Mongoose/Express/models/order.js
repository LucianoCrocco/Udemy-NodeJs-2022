const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products : {
        type : [
            { 
                product : {type : Object, required : true},
                quantity : {type : Number, required : true}
            }
        ]
    },
    user : {
        name : {type : String, required : true},
        userId : {type : mongoose.Types.ObjectId, required : true, ref : 'User'}
    }
})

module.exports = mongoose.model("Order", orderSchema);