let express = require("express");
let router = express.Router();
let controller = require("../controllers/products-controller");
let authMiddleware = require("../utils/middleware");

/* GET products listing. */
router.get("/", controller.getAllProducts);

router.post('/addProduct', controller.addProduct);

router.patch(
  "/enableProduct/:id",
  authMiddleware.authorizeAdminUser,
  controller.toggleProductVisibility
);

router.delete("/:id", authMiddleware.authorizeAdminUser, controller.deleteProduct);

router.put("/:id", authMiddleware.authorizeAdminUser, controller.updateProduct);

module.exports = router;
