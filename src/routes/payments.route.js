import { Router } from "express"
import { jwtverify } from "../middleware/auth.middleware.js";
import { createOrder, verifypayment } from "../controllers/payment.controller.js";

const router = Router();

router.route("/create").post(jwtverify,createOrder)

router.route("/verifypayment").post(jwtverify,verifypayment)

export default router