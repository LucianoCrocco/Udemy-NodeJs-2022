const {body} = require("express-validator");

exports.valPostAddProduct = [
body("title", "Enter a valid Title, alphanumeric and a minimum of 3 characteres.")
    .isString()
    .isLength({min : 3})
    .trim(),
body("price", "Enter a valid price").isFloat(),
body("description", "Enter a valid Description, alphanumeric and a minimum of 5 characteres and maximum 500.")
    .isLength({min : 5, max : 400})
    .trim()
]

exports.valPostEditProduct = [
body("title", "Enter a valid Title, alphanumeric and a minimum of 3 characteres.")
    .isString()
    .isLength({min : 3})
    .trim(),
body("price", "Enter a valid price").isFloat(),
body("description", "Enter a valid Description, alphanumeric and a minimum of 4 characteres and maximum 400.")
    .isLength({min : 5, max : 500})
    .trim()
]