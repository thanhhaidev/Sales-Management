const express = require("express");
const router = express.Router();
const CustomerController = require("../controller/customer");
const checkAuth = require("../middleware/check-auth");
const checkRole = require("../middleware/check-role");

router.post("/", checkAuth, CustomerController.customer_create);
router.get("/", checkAuth, CustomerController.get_all_customer);
router.delete("/:customerID", checkRole, CustomerController.delete_customer);
router.patch("/:customerID", checkAuth, CustomerController.update_customer);

module.exports = router;