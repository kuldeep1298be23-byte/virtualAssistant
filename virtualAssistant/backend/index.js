import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/user.routes.js";
import groqResponse from "./gemini.js";

const app=express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const port=process.env.PORT || 5000

app.use(express.json())//* data ko json format mae convert kar rahe h
app.use(cookieParser())//* cookie-parser is a middleware that helps your server read cookies sent by the client
app.use("/api/auth",authRouter)//* authrouter ka use karke hum jitne bhi route lekar aayenge unke aage "/api/auth" lga dega yae middleware
app.use("/api/user",UserRouter)

// app.get("/", async (req,res)=>{
//     let prompt=req.query.prompt;
//     let data= await groqResponse(prompt);
//      res.json({respose:data}); 
// })

app.listen(port,()=>{
    connectDb();
    console.log("server started");
})

//* CORS is a security rule (enforced by browsers) that decides:
// *“Should this frontend be allowed to access this backend?”

