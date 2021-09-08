const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");
const auth = require("../middlewares/auth");

router
  .get("/", auth.verifyAccess, auth.autorizedAdmin, orderController.getAllOrder)
  .get("/order/:id", auth.verifyAccess, orderController.getOrder)
  .post(
    "/user/:id",
    auth.verifyAccess,
    auth.autorizedCustommer,
    orderController.getOrderByUserId
  )
  .post("/", auth.verifyAccess, orderController.insertOrder)
  .put(
    "/:id",
    auth.verifyAccess,
    orderController.updateOrder
  )
  .delete("/:id", auth.verifyAccess, orderController.deleteOrder);

module.exports = router;
