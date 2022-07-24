const express = require("express");
const {verifyAccessToken} = require("../middlewares/auth");
const apiContoller = require("../controllers/api");
const router = express.Router();

// Customer
router.post("/customer_login", apiContoller.customer_login);
router.post("/customer_register", apiContoller.customer_register);
router.post("/customer_update", verifyAccessToken, apiContoller.customer_update);

// eVoucher
router.post("/eVoucher_save", verifyAccessToken, apiContoller.eVoucher_save);
router.post("/eVoucher_list", verifyAccessToken, apiContoller.eVoucher_list);
router.post("/eVoucher_detail", verifyAccessToken, apiContoller.eVoucher_detail);

// Payment
router.post("/payment_methods_list", verifyAccessToken, apiContoller.payment_methods_list);
router.post("/check_out_list", verifyAccessToken, apiContoller.check_out_list);
router.post("/make_payment", verifyAccessToken, apiContoller.make_payment);

// Promo Code
router.post("/set_promo_code", verifyAccessToken, apiContoller.set_promo_code);
router.post("/verify_promo_code", verifyAccessToken, apiContoller.verify_promo_code);
router.post("/use_promo_code", verifyAccessToken, apiContoller.use_promo_code);

module.exports = router;