import express from "express";
import { signUp } from "../controllers/auth.controllers.js";
import { Login, LogOut } from "../controllers/auth.controllers.js";

const authRouter=express.Router()

authRouter.post("/signup",signUp) //* post req use karenge because hum data bhi lekar aa rahe h frontend sae okk.
authRouter.post("/signin",Login)
authRouter.get("/logout",LogOut)//* yaha frontend sae koi data nhi lena h sirf cookie remove hota h isliye get kiya h.
export default authRouter
