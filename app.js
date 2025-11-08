import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./src/routes/user.route.js"
import productroute from "./src/routes/product.route.js"
import Cartroute from "./src/routes/cart.route.js"
import WishlistRoute from "./src/routes/wishlist.route.js"
import ReviewRoute from "./src/routes/reviews.route.js"
import OrderRoute from "./src/routes/order.route.js"
import PaymentRoute from "./src/routes/payments.route.js"


const app = express();

app.use(cookieParser());

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use('/api/user',userRoute)

app.use('/product',productroute)

app.use((req, res, next) => {
    if (req.path.includes('/order')) {
        console.log(`📨 ORDER REQUEST: ${req.method} ${req.path}`);
    }
    next();
});

app.use('/cart',Cartroute)

app.use('/wishlist',WishlistRoute)

app.use('/reviews',ReviewRoute)

console.log("📦 Registering order routes...");
app.use('/order', OrderRoute);
console.log("✅ Order routes registered!");

app.use('/payments',PaymentRoute)

export default app;