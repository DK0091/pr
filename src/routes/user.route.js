import { Router } from "express";
import { checktoken, currentuser, deleteaccount, deletenotification, enable2F,
forgotpassword, getnotifications, login, logout, notificationread, registeruser,
resetpassword, updatedetails, updatepassword, updaterole, uploadavatar, verify2FA } from "../controllers/user.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";
import { uploadToCloudinary } from "../middleware/multer.middleware.js";
import { adminonly } from "../middleware/admin.middleware.js";

const router = Router()

router.route("/register").post(uploadToCloudinary("avatars").single("avatar"),registeruser)

router.route("/login").post(login)

router.route("/refreshtoken").post(checktoken)

router.route("/currentuser").get(jwtverify,currentuser)

router.route("/changepassword").post(jwtverify,updatepassword)

router.route("/logout").post(jwtverify,logout)

router.route("/updatedetails").post(jwtverify,updatedetails)

router.route('/avatar').put(jwtverify,uploadToCloudinary("avatars").single("avatar"),uploadavatar)

router.route('/deleteaccount').delete(jwtverify,deleteaccount)

router.route('/updaterole/:id').post(jwtverify,adminonly,updaterole)

router.route('/notifications').get(jwtverify,getnotifications)

router.route('/notifications/:id').put(jwtverify,notificationread)

router.route('/deletenotifications/:id').delete(jwtverify,deletenotification)

router.route('/forgotpassword').post(forgotpassword)

router.route('/reset-password/:userid/:token').post(resetpassword)

router.route('/enable2FA').post(jwtverify,enable2F)

router.route('/verify2FA').post(verify2FA)

export default router