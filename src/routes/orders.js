const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");
const auth = require("../middlewares/auth");

router
  .get("/", auth.verifyAccess, auth.autorizedAdmin, orderController.getAllOrder)
  .get("/order/:id", auth.verifyAccess, orderController.getOrder)
  .get(
    "/user/:id",
    auth.verifyAccess,
    auth.autorizedCustommer,
    orderController.getOrderByUserId
  )
  .post("/", auth.verifyAccess, orderController.insertOrder)
  .put(
    "/:id",
    auth.verifyAccess,
    auth.autorizedAdmin,
    orderController.updateOrder
  )
  .patch("/", auth.verifyAccess, orderController.deleteOrder);

module.exports = router;
