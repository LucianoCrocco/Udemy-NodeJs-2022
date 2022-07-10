const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();
/* GET */
router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct)
router.get("/cart", isAuth, shopController.getCart);
// router.get("/checkout", shopController.getCheckout)
router.get("/orders", isAuth, shopController.getOrders);

/* POST */
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct)
router.post("/create-order", isAuth, shopController.postOrder);

module.exports = router;