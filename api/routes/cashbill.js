const express = require("express");
const router = express.Router();
const CashBillController = require("../controller/cashbill");
const checkAuth = require("../middleware/check-auth");

router.post("/", checkAuth, CashBillController.cashbill_create);
router.get("/", checkAuth, CashBillController.get_all_cashbill);
router.delete("/:cashbillID", checkAuth, CashBillController.delete_cashbill);
router.patch("/:cashbillID", checkAuth, CashBillController.update_cashbill);

module.exports = router;