import { Router } from "express"
import { addproduct,deleteProduct, getallproducts, getproductbyId, searchAndFilter, updateproduct } from "../controllers/product.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";
import isseller from "../middleware/seller.middleware.js";

const router = Router();

// anyone
router.route('/').get(getallproducts)

router.route('/:id').get(getproductbyId)

//seller
router.route('/addproduct').post(jwtverify,isseller,addproduct)

// admin and seller
router.route("/delete/:id").delete(jwtverify,deleteProduct)

router.route("/update/:id").put(jwtverify,updateproduct)

router.route("/search").get(searchAndFilter)

export default router