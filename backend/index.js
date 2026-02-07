import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";

dotenv.config();    


const app = express();

app.get("/", (req, res) => {
    res.send("working sir");
}); 


// importing routes
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";


// using routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

const PORT =process.env.PORT;  
app.listen(PORT, () => {
    console.log(`✅Server is running on  http://localhost:${PORT}`);
    connectDB();
    }); 
