import { Router } from "express";
import { addReview, deletereview, getallreviews, updatereview } from "../controllers/review.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";

const router = Router();

// Base path will be `/reviews` in app.js, so we use relative segments here
router.route('/:productId').get(getallreviews)

router.route("/add/:productId").post(jwtverify,addReview)

router.route('/delete/:productId').delete(jwtverify,deletereview)

router.route('/update/:productId').put(jwtverify,updatereview)

export default router