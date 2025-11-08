import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // explicitly give the path
 
import connectdb from "./src/config/db.js"
import app from "./app.js"


console.log(process.env.PORT)
const PORT = process.env.PORT || 8000;

connectdb().then(()=>{
    app.listen(PORT ,()=>{
         console.log(`✅ Server running on http://localhost:${PORT}`);
    })
}).catch((err)=>{
        console.error("❌ DB Connection Failed:", err.message);
})





