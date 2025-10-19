import { Router } from "express";
import { addTowishlist, getWishlist, removeFromwishlist } from "../controllers/wishlist.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";
import { Wishlist } from "../models/wishlist.model.js";

const router = Router()

router.route('/add/:productId').post(jwtverify,addTowishlist)

router.route('/').get(jwtverify,getWishlist)

router.route('/remove/:productId').delete(jwtverify,removeFromwishlist)

export default router