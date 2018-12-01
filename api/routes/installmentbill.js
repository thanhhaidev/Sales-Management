const express = require("express");
const router = express.Router();
const InstallmentBillController = require("../controller/installmentbill");
const checkAuth = require("../middleware/check-auth");

router.post("/", checkAuth, InstallmentBillController.installmentbill_create);
router.get("/", checkAuth, InstallmentBillController.get_all_installmentbill);
router.delete("/:installmentbillID", checkAuth, InstallmentBillController.delete_installmentbill);
router.patch("/:installmentbillID", checkAuth, InstallmentBillController.update_installmentbill);

module.exports = router;