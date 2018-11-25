const express = require("express");
const router = express.Router();
const UserController = require("../controller/user");
const checkAuth = require("../middleware/check-auth");
const checkRole = require("../middleware/check-role");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./upload/avatars/");
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

router.get("/", checkRole, UserController.get_all_user);
router.get("/info/:userId", checkAuth, UserController.get_info_user);
router.post("/signup", upload.single("avatar"), UserController.user_signup);
router.post("/login", UserController.user_login);
router.delete("/delete/:userId", checkRole, UserController.user_delete);
router.patch("/update/:userId", checkAuth, UserController.update_info_user);
module.exports = router;