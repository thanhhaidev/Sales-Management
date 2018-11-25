const express = require("express");
const router = express.Router();
const ProductController = require("../controller/product");
const checkAuth = require("../middleware/check-auth");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./upload/products/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post("/", checkAuth, upload.single("Avatar"), ProductController.product_create);
router.get("/", checkAuth, ProductController.get_all_product);
router.delete("/:productCode", checkAuth, ProductController.delete_product);
router.patch("/:productCode", checkAuth, ProductController.update_product);

module.exports = router;