const express = require("express");
const router = express.Router();
const CustomerController = require("../controller/customer");
const checkAuth = require("../middleware/check-auth");

router.post("/", checkAuth, CustomerController.customer_create);
router.get("/", checkAuth, CustomerController.get_all_customer);
//router.delete("/:customerID", checkAuth, CustomerController.delete_category);
router.patch("/:customerID", checkAuth, CustomerController.update_customer);

module.exports = router;