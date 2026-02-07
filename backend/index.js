import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";
import cloudinary from "cloudinary";

dotenv.config();    


cloudinary.v2.config({
  cloud_name: process.env.Cloudinary_Cloud_Name,
  api_key: process.env.Cloudinary_Api,
  api_secret: process.env.Cloudinary_Secret,
});

const app = express();
app.use(express.json());



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
