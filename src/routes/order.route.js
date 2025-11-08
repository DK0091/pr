import { Router } from "express";
import { jwtverify } from "../middleware/auth.middleware.js";
import {
  buyNow,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";
import { adminonly } from "../middleware/admin.middleware.js";

const router = Router();


router.post("/buy/:productId",jwtverify, buyNow);
router.get("/my", jwtverify, getMyOrders);
router.get("/:orderId", jwtverify, getOrderById);
router.put("/cancel/:orderId", jwtverify, cancelOrder);


router.get("/admin/all", jwtverify, adminonly, getAllOrders);
router.put("/admin/update/:orderId", jwtverify, adminonly, updateOrderStatus);

export default router;
