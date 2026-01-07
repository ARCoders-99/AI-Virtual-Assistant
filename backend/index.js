import express from "express";

import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/userRoutes.js";
import geminiResponse from "./gemini.js";

dotenv.config();

const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const port = process.env.PORT || 6000;

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth" , authRouter)
app.use("/api/user" , userRouter)


app.listen(port,()=>{
    connectDb()
    console.log("Server is running....")
})
