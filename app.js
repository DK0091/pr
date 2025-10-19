import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "../pr/src/routes/user.route.js"
import productroute from "../pr/src/routes/product.route.js"
import Cartroute from "../pr/src/routes/cart.route.js"
import WishlistRoute from "../pr/src/routes/wishlist.route.js"
const app = express();

app.use(cookieParser());

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/user',userRoute)

app.use('/product',productroute)

app.use('/cart',Cartroute)

app.use('/Wishlist',WishlistRoute)

export default app;