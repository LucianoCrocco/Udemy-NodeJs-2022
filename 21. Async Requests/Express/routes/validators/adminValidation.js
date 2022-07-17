const {body} = require("express-validator");

exports.valPostAddProduct = [
body("title", "Enter a valid Title, alphanumeric and a minimum of 3 characteres.")
    .isString()
    .trim()
    .isLength({min : 3}),
body("price", "Enter a valid price").isFloat(),
body("description", "Enter a valid Description, alphanumeric and a minimum of 5 characteres and maximum 500.")
    .trim()
    .isLength({min : 5, max : 400})
]

exports.valPostEditProduct = [
body("title", "Enter a valid Title, alphanumeric and a minimum of 3 characteres.")
    .isString()
    .trim()
    .isLength({min : 3}),
body("price", "Enter a valid price").isFloat(),
body("description", "Enter a valid Description, alphanumeric and a minimum of 4 characteres and maximum 400.")
    .trim() 
    .isLength({min : 5, max : 500})
]