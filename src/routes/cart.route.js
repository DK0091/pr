import { Router } from "express"
import {addtocart, deleteitem, placeorder, updateQuantity, getcart} from "../controllers/cart.controller.js"
import { jwtverify } from "../middleware/auth.middleware.js"

const router = Router();

// Get user's cart
router.route('/').get(jwtverify, getcart)

// Add item to cart
router.route('/add/:id').post(jwtverify, addtocart)

// Update item quantity
router.route('/update/:id').put(jwtverify, updateQuantity)

// Remove item from cart
router.route('/remove/:id').delete(jwtverify, deleteitem)

// Place order
router.route('/placeorder').post(jwtverify, placeorder)

export default router