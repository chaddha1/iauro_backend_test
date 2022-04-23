var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-controller");
let authMiddleware = require("../utils/middleware");

// signup
router.post("/signup", controller.signup);

// sign in
router.post("/login", controller.login);

router.delete("/:id", authMiddleware.authorizeAdminUser, controller.deleteUser);

router.put("/:id", authMiddleware.authorizeAdminUser, controller.updateUser);

module.exports = router;
