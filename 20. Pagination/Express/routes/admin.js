const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const {valPostAddProduct, valPostEditProduct} = require("./validators/adminValidation");

const router = express.Router();


router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/products", isAuth, adminController.getProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);
router.post("/add-product", isAuth, valPostAddProduct, adminController.postAddProduct);
router.post("/edit-product", isAuth, valPostEditProduct, adminController.postEditProduct);
module.exports = router;
