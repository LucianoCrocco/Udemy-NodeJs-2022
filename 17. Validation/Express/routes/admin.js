const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const {body} = require("express-validator");

const router = express.Router();


router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/products", isAuth, adminController.getProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);
router.post("/add-product", isAuth,
[
body("title", "Enter a valid Title, alphanumeric and a minimum of 3 characteres.")
    .isString()
    .isLength({min : 3})
    .trim(),
body("imageUrl", "Enter a valid URL.").isURL(),
body("price", "Enter a valid price").isFloat(),
body("description", "Enter a valid Description, alphanumeric and a minimum of 5 characteres and maximum 500.")
    .isLength({min : 5, max : 400})
    .trim()
], 
adminController.postAddProduct);
router.post("/edit-product", isAuth,
[
body("title", "Enter a valid Title, alphanumeric and a minimum of 3 characteres.")
    .isString()
    .isLength({min : 3})
    .trim(),
body("imageUrl", "Enter a valid URL.").isURL(),
body("price", "Enter a valid price").isFloat(),
body("description", "Enter a valid Description, alphanumeric and a minimum of 4 characteres and maximum 400.")
    .isLength({min : 5, max : 500})
    .trim()
], 
adminController.postEditProduct);
module.exports = router;
