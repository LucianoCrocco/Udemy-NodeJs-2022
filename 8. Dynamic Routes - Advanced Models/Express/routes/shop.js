const express = require("express");
const path = require("path");

const shopController = require("../controllers/shop");

const router = express.Router();

/* GET */
router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct)
router.get("/cart", shopController.getCart);
router.get("/checkout", shopController.getCheckout)
router.get("/orders", shopController.getOrders);

/* POST */
router.post("/cart", shopController.postCart);
router.post("/cart-delete-item", shopController.postCartDeleteProduct)

module.exports = router;