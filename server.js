import dotenv from "dotenv"
dotenv.config();
import connectdb from "./src/config/db.js"
import app from "./app.js"

const PORT = process.env.PORT || 3000;
connectdb().then(()=>{
    app.listen(PORT ,()=>{
         console.log(`✅ Server running on http://localhost:${PORT}`);
    })
}).catch((err)=>{
        console.error("❌ DB Connection Failed:", err.message);
})





