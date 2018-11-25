const express = require("express");
const router = express.Router();
const CategoryController = require("../controller/category");
const checkAuth = require("../middleware/check-auth");

router.post("/", checkAuth, CategoryController.category_create);
router.get("/", checkAuth, CategoryController.get_all_category);
router.delete("/:categoryID", checkAuth, CategoryController.delete_category);
router.patch("/:categoryID", checkAuth, CategoryController.update_category);

module.exports = router;